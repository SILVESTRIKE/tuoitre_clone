// frontend/src/services/apiService.js

const API_BASE_URL = 'http://localhost:3000/api'; // Thay đổi PORT nếu backend của bạn chạy ở port khác

export async function fetchArticles() {
    try {
        const response = await fetch(`${API_BASE_URL}/articles`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Lỗi khi lấy danh sách bài viết: ${errorData.message || response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi API fetchArticles:", error);
        throw error; // Re-throw để component có thể bắt và hiển thị lỗi
    }
}

export async function fetchArticleBySlug(slug) {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/slug/${slug}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Lỗi khi lấy bài viết với slug "${slug}": ${errorData.message || response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Lỗi API fetchArticleBySlug (${slug}):`, error);
        throw error;
    }
}

export async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Lỗi khi lấy danh sách danh mục: ${errorData.message || response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Lỗi API fetchCategories:", error);
        throw error;
    }
}

export async function fetchArticlesByCategorySlug(categorySlug) {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/category/${categorySlug}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Lỗi khi lấy bài viết theo danh mục "${categorySlug}": ${errorData.message || response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Lỗi API fetchArticlesByCategorySlug (${categorySlug}):`, error);
        throw error;
    }
}

