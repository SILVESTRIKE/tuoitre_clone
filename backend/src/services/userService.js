const User = require('../models/user_model');
const bcrypt = require('bcryptjs');
const Otp = require('../models/otp');
const { sendEmail } = require('../services/email');

const userService = {
    // --- Các hàm quản lý User ---
    getAll: async () => {
        return await User.find().select('-password');
    },

    getById: async (id) => {
        const user = await User.findById(id).select('-password');
        if (!user) throw new Error('Không tìm thấy người dùng');
        return user;
    },

    getByEmail: async (email, selectPassword = false) => {
        // Thêm option để có thể lấy cả password khi cần (chỉ dùng cho nội bộ service)
        const query = User.findOne({ email });
        const user = await (selectPassword ? query : query.select('-password'));

        if (!user) throw new Error('Không tìm thấy người dùng');
        return user;
    },

    createUser: async ({ username, email, password }) => {
        const existed = await User.findOne({ email });
        if (existed) {
            throw new Error('Email đã tồn tại.');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        await userService.sendOtp(user.email); // Gửi OTP sau khi tạo
        return user;
    },

    updateUser: async (id, data) => {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) throw new Error('Cập nhật thất bại, không tìm thấy người dùng.');
        return updatedUser;
    },

    deleteUser: async (id) => {
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new Error('Không tìm thấy người dùng');
        return true;
    },

    // --- Các hàm xử lý OTP ---
    sendOtp: async (email) => {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Không tìm thấy người dùng');
        if (user.verify) throw new Error('Tài khoản này đã được xác thực rồi.');

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.deleteMany({ userId: user._id }); // Xóa OTP cũ nếu có
        await new Otp({ userId: user._id, otp: otpCode }).save();
        await sendEmail(user.email, otpCode);
        return { message: 'OTP đã được gửi đến email của bạn' };
    },

    verifyOtp: async (email, otp) => {
        const user = await User.findOne({ email });
        if (!user) throw new Error('Email không hợp lệ');

        const otpRecord = await Otp.findOne({ userId: user._id, otp: otp });
        if (!otpRecord) throw new Error('OTP không hợp lệ hoặc đã hết hạn');

        await User.findByIdAndUpdate(user._id, { verify: true });
        await Otp.deleteOne({ _id: otpRecord._id });
        return true;
    },
};

module.exports = userService;