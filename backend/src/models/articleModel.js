const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    sapo: {
        type: String,
        required: false,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    content: {
        type: [String],
        required: false,
    },
    image: {
        type: String,
        required: false,
        trim: true,
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
    }],
    slug: {
        type: String,
        required: false,
        trim: true,
        // Xóa index vì không sử dụng trong code crawl hiện tại
    },
    fullText: {
        type: String,
        required: false,
        trim: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Article', articleSchema);