const articleService = require('../services/articleService');

const getAllArticles = async (req, res) => {
    try {
        const articles = await articleService.getAllArticles();
        res.status(200).json(articles);
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
const getArticlesByCategory = async (req, res) => {
    try {
        console.log('Fetching articles for category ID:', req.params.id);
        const articles = await articleService.getArticlesByCategorySlug(req.params.id);
        if (!articles || articles.length === 0) {
            return res.status(404).json({ message: 'No articles found for this category' });
        }
        res.json(articles);
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
    getArticlesByCategory,
};