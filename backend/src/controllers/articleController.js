const articleService = require('../services/articleService');

const getAllArticles = async (req, res) => {
    try {
        const articles = await articleService.getAllArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getArticleById = async (req, res) => {
    try {
        const article = await articleService.getArticleById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getArticleBySlug = async (req, res) => {
    try {
        const article = await articleService.getArticleBySlug(req.params.slug);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createArticle = async (req, res) => {
    try {
        const newArticle = await articleService.createArticle(req.body);
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateArticle = async (req, res) => {
    try {
        const updatedArticle = await articleService.updateArticle(req.params.id, req.body);
        if (!updatedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(updatedArticle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const deleted = await articleService.deleteArticle(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllArticles,
    getArticleById,
    getArticleBySlug,
    createArticle,
    updateArticle,
    deleteArticle,
};