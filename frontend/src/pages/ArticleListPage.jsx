// frontend/src/pages/ArticleListPage.jsx
import React, { useEffect, useState } from 'react';
import ArticleCard from '../components/ArticleCard';
// Import cả hai hàm fetch articles
import { fetchArticles, fetchArticlesByCategorySlug } from '../services/apiService';
import { useParams } from 'react-router-dom'; // Import useParams

// Nhận props từ router
function ArticleListPage() {
    const { categorySlug } = useParams(); // Lấy categorySlug từ URL params. Nếu không có, nó sẽ là undefined.

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getArticles = async () => {
            try {
                setLoading(true);
                setError(null);

                let data;
                // Kiểm tra xem categorySlug có tồn tại trong URL không
                if (categorySlug) {
                    // Nếu có slug, fetch bài viết theo danh mục đó
                    data = await fetchArticlesByCategorySlug(categorySlug);
                } else {
                    // Nếu không có slug (nghĩa là đang ở trang /), fetch tất cả bài viết
                    data = await fetchArticles();
                }
                setArticles(data);
            } catch (err) {
                setError(err.message);
                setArticles([]);
            } finally {
                setLoading(false);
            }
        };

        getArticles();
    }, [categorySlug]); // Dependency array: chạy lại mỗi khi categorySlug từ URL thay đổi

    return (
        <div className="article-list-container">
            <h1>Danh sách Bài viết {categorySlug ? `(${categorySlug.toUpperCase()})` : ''}</h1> {/* Hiển thị tên danh mục */}
            {loading && <p>Đang tải bài viết...</p>}
            {error && <p className="error-message">Lỗi: {error}</p>}
            {!loading && !error && articles.length === 0 && (
                <p>Chưa có bài viết nào.</p>
            )}
            {!loading && !error && articles.length > 0 && (
                <div className="articles-grid">
                    {articles.map(article => (
                        <ArticleCard key={article._id} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ArticleListPage;