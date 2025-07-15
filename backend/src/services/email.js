const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendEmail = async (to, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Mã OTP của bạn',
        text: `Mã OTP của bạn là ${otp}. Mã này sẽ hết hạn sau 1 phút.`,
    };

    try {
        console.log('Gửi email từ:', process.env.EMAIL_USER);
        await transporter.sendMail(mailOptions);
        console.log('Đã gửi mail đến:', to);
        console.log('Otp:', otp);
    } catch (error) {
        console.error('Lỗi gửi mail:', error);
        throw new Error('Không thể gửi email');
    }
};


