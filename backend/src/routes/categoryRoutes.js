const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
// const validate = require('../middleware/validationMiddleware'); // Assuming you have validation middleware
// const { categorySchema } = require('../dto/categoryDto'); // Assuming Joi schema for categories

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Operations related to categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category' # Reference to your Category schema
 *       500:
 *         description: Internal server error
 */
router.get('/', categoryController.getAllCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', categoryController.getCategoryById);
// --- Routes for Admin/CRUD (Optional) ---
/*
// POST /categories - Create a new category (Admin only)
router.post('/', validate(categorySchema), categoryController.createCategory);

// PUT /categories/:id - Update a category (Admin only)
router.put('/:id', validate(categorySchema), categoryController.updateCategory);

// DELETE /categories/:id - Delete a category (Admin only)
router.delete('/:id', categoryController.deleteCategory);
*/

module.exports = router;