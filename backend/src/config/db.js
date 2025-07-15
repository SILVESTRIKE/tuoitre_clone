const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Kết nối đến MongoDB thành công');
    } catch (error) {
        console.error('Lỗi kết nối đến MongoDB:', error);
        process.exit(1); // Dừng ứng dụng nếu không thể kết nối
    }
}
module.exports = connectDB;