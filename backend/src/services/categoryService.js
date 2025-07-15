const Category = require('../models/categoryModel');

const categoryService = {
    async getAllCategories() {
        return await Category.find();
    },

    async getCategoryById(id) {
        return await Category.findById(id);
    },

    async createCategory(data) {
        const category = new Category(data);
        return await category.save();
    },

    async updateCategory(id, data) {
        return await Category.findByIdAndUpdate(id, data, { new: true });
    },

    async deleteCategory(id) {
        return await Category.findByIdAndDelete(id);
    }
};

module.exports = categoryService;