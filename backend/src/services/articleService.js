const Article = require('../models/articleModel');
const Category = require('../models/categoryModel');
const mongoose = require('mongoose');

const articleService = {
    async getAllArticles() {
        try {
            return await Article.find();
        } catch (error) {
            console.error('Lỗi khi lấy tất cả bài viết:', error.message);
            throw new Error('Không thể lấy danh sách bài viết');
        }
    },

    async getArticleById(id) {
        try {
            return await Article.findById(id);
        } catch (error) {
            console.error(`Lỗi khi lấy bài viết với id ${id}:`, error.message);
            throw new Error('Không thể lấy bài viết');
        }
    },
    async getArticleBySlug(slug) {
        try {
            return await Article.findOne({ slug });
        } catch (error) {
            console.error(`Lỗi khi lấy bài viết với slug ${slug}:`, error.message);
            throw new Error('Không thể lấy bài viết ');
        }
    },

    async createArticle(data) {
        try {
            const article = new Article(data);
            return await article.save();
        } catch (error) {
            console.error('Lỗi khi tạo bài viết:', error.message);
            throw new Error('Không thể tạo bài viết');
        }
    },

    async updateArticle(id, data) {
        try {
            return await Article.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error(`Lỗi khi cập nhật bài viết với id ${id}:`, error.message);
            throw new Error('Không thể cập nhật bài viết');
        }
    },

    async deleteArticle(id) {
        try {
            return await Article.findByIdAndDelete(id);
        } catch (error) {
            console.error(`Lỗi khi xoá bài viết với id ${id}:`, error.message);
            throw new Error('Không thể xoá bài viết');
        }
    },
    async getArticlesByCategorySlug(categorySlug) {
        try {
            const cate = await Category.findOne({ slug: categorySlug });

            if (!cate) {
                throw new Error('Danh mục không tồn tại');
            }
            return await Article.find({
                category: { $in: [cate._id] }
            });
        } catch (error) {
            console.error(`Lỗi khi lấy bài viết theo danh mục với slug ${categorySlug}:`, error.message);
            throw new Error('Không thể lấy bài viết theo danh mục');
        }
    }
};

module.exports = articleService;