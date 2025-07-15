const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,

        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
}, {
    timestamps: true
});
module.exports = mongoose.model('Subcategory', categorySchema);