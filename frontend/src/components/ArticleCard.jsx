
import React from 'react';
import { Link } from 'react-router-dom'; 
import './ArticleCard.css'; 

function ArticleCard({ article }) {
    
    const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    return (
        <div className="article-card">
            {article.image && (
                <img src={article.image} alt={article.title} className="article-card-image" />
            )}
            <div className="article-card-content">
                <h3 className="article-card-title">
                    {/* Sử dụng Link để điều hướng đến trang chi tiết bài viết */}
                    <Link to={`/slug/${slug}`}>{article.title}</Link>
                </h3>
                {article.sapo && <p className="article-card-sapo">{article.sapo}</p>}
                <p className="article-card-meta">
                    {new Date(article.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}

export default ArticleCard;