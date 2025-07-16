const categoryService = require('../services/categoryService');
const articleService = require('../services/articleService');

module.exports = {
    // Get all categories
    async getAllCategories(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get category by ID
    async getCategoryById(req, res) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) return res.status(404).json({ message: 'Category not found' });
            res.json(category);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Create new category
    async createCategory(req, res) {
        try {
            const newCategory = await categoryService.createCategory(req.body);
            res.status(201).json(newCategory);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Update category
    async updateCategory(req, res) {
        try {
            const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
            if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
            res.json(updatedCategory);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete category
    async deleteCategory(req, res) {
        try {
            const deleted = await categoryService.deleteCategory(req.params.id);
            if (!deleted) return res.status(404).json({ message: 'Category not found' });
            res.json({ message: 'Category deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get articles by category
    async getArticlesByCategory(req, res) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            const articles = await articleService.getArticleById(req.params.id);
            res.json(articles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};