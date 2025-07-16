// frontend/src/pages/ArticleDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Cần react-router-dom cho routing
import { fetchArticleBySlug } from '../services/apiService';
import './ArticleDetailPage.css'; // Tạo file CSS riêng cho trang chi tiết

function ArticleDetailPage() {
    const { slug } = useParams(); // Lấy slug từ URL parameters
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getArticle = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchArticleBySlug(slug);
                setArticle(data);
            } catch (err) {
                setError(err.message);
                setArticle(null);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            getArticle();
        }
    }, [slug]); // Chạy lại khi slug thay đổi

    if (loading) return <div className="loading-detail">Đang tải chi tiết bài viết...</div>;
    if (error) return <div className="error-detail">Lỗi: {error}</div>;
    if (!article) return <div className="not-found-detail">Không tìm thấy bài viết.</div>;

    return (
        <div className="article-detail-container">
            <Link to="/" className="back-to-list">← Quay lại danh sách</Link>
            {article.image && (
                <img src={article.image} alt={article.title} className="article-detail-image" />
            )}
            <h1>{article.title}</h1>
            {article.sapo && <p className="article-sapo">{article.sapo}</p>}
            <div className="article-content">
                {/* Hiển thị nội dung bài viết. Nếu content là array of strings, cần xử lý */}
                {article.content && article.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
                {/* Hoặc nếu bạn lưu nội dung dạng HTML: */}
                {/* {article.contentHtml && <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />} */}
            </div>
            <p className="article-meta">
                Đăng ngày: {new Date(article.createdAt).toLocaleDateString()}
            </p>
        </div>
    );
}

export default ArticleDetailPage;