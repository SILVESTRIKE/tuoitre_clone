const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Unique index tự động được tạo
    },
    url: {
        type: String,
        required: true,
        trim: true,
        unique: true, // Unique index tự động được tạo
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Category', categorySchema);