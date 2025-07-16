const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const validate = require('../../middleware/validationMiddleware'); // Assuming you have validation middleware
const { articleSchema } = require('../dto/articleDto'); // Assuming Joi schema for articles
const logger = require('../../logging/logger');

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Operations related to articles
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter articles by category slug
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of articles per page
 *     responses:
 *       200:
 *         description: A list of articles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article' # Reference to your Article schema in Swagger config
 *       500:
 *         description: Internal server error
 */
router.get('/', articleController.getAllArticles);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Get a single article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: The article ID
 *     responses:
 *       200:
 *         description: Article details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', articleController.getArticleById);

/**
 * @swagger
 * /articles/slug/{slug}:
 *   get:
 *     summary: Get a single article by Slug
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *         description: The article slug
 *     responses:
 *       200:
 *         description: Article details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
router.get('/slug/:slug', articleController.getArticleBySlug);
/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Article' # Reference to your Article schema in Swagger config
 *     responses:
 *       201:
 *         description: Article created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/category/:id', articleController.getArticlesByCategory);
// --- Routes for Admin/CRUD (Optional for this challenge, but good to have) ---
/*
// POST /articles - Create a new article (Admin only)
router.post('/', validate(articleSchema), articleController.createArticle);

// PUT /articles/:id - Update an article (Admin only)
router.put('/:id', validate(articleSchema), articleController.updateArticle);

// DELETE /articles/:id - Delete an article (Admin only)
router.delete('/:id', articleController.deleteArticle);
*/

module.exports = router;