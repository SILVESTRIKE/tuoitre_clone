const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('./user_service');

const authService = {

    login: async (email, password) => {

        const user = await userService.getByEmail(email, true);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Sai mật khẩu');

        if (!user.verify) {
            await userService.sendOtp(user.email).catch(err => console.log(err.message));
            throw new Error('Tài khoản chưa được xác thực. OTP mới đã được gửi đến email của bạn.');
        }

        const accessToken = authService.createToken({ userId: user._id, name: user.username }, process.env.JWT_SECRET, '30');
        const refreshToken = authService.createToken({ userId: user._id, name: user.username }, process.env.JWT_REFRESH_SECRET, '7d');

        const { password: _, ...userWithoutPassword } = user.toObject();
        return { user: userWithoutPassword, accessToken, refreshToken };
    },

    createToken: (payload, secret, expiresIn) => {
        return jwt.sign(payload, secret, { expiresIn });
    },

    authenticateUser: async (req, res) => {
        const accessToken = req.cookies.accessToken;

        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
                const user = await userService.getById(decoded.userId);
                if (user) return user;
            } catch (error) {

            }
        }

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return null;

        try {
            const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await userService.getById(decodedRefresh.userId);

            const newAccessToken = authService.createToken({ userId: user._id, name: user.username }, process.env.JWT_SECRET, '15m');
            res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 15 * 60 * 1000 });

            return user;
        } catch (err) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return null;
        }
    }
};

module.exports = authService;