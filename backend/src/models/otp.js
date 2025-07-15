const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //Tham chiếu đến mô hình User
        unique: true, // Mỗi người dùng chỉ có một OTP tại một thời điểm
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 1000
    },
});
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 0 }); // TTL index tự động xóa OTP sau 60 giây của MongoDB
module.exports = mongoose.model('Otp', otpSchema);