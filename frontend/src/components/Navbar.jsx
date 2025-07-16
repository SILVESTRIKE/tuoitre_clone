// frontend/src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
// Import Link và useMatch
import { Link, useMatch } from 'react-router-dom';
import { fetchCategories } from '../services/apiService';
import './Navbar.css'; // Nên tạo file CSS riêng cho Navbar

function Navbar() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hook để kiểm tra xem đường dẫn hiện tại có khớp với path được cung cấp không
    // useMatch('/') sẽ trả về một object nếu URL là '/', hoặc null nếu không khớp
    const homeMatch = useMatch('/');
    // useMatch('/category/:categorySlug') sẽ trả về object nếu URL có dạng /category/xxx, hoặc null
    const categoryMatch = useMatch('/:categorySlug');

    // Lấy slug danh mục đang hoạt động để highlight
    // Nếu homeMatch là true thì activeCategorySlug là null (cho nút "Tất cả")
    // Nếu categoryMatch có tồn tại và có params.categorySlug, thì đó là slug đang hoạt động
    const activeCategorySlug = homeMatch ? null : (categoryMatch ? categoryMatch.params.categorySlug : null);

    useEffect(() => {
        async function loadCategories() {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                setError(err.message);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        }
        loadCategories();
    }, []);

    return (
        <nav className="navbar">
            <span className="navbar-label">Danh mục:</span>

            {/* Link "Tất cả" */}
            <Link
                to="/"
                // Thêm class 'active' nếu homeMatch là true (tức là đang ở trang gốc '/')
                className={`navbar-link ${homeMatch ? 'active' : ''}`}
            >
                Tất cả
            </Link>

            {loading && <span className="navbar-loading">Đang tải danh mục...</span>}
            {error && <span className="navbar-error">{error}</span>}

            {!loading && !error && categories.map(cate => (
                <Link
                    key={cate._id}
                    to={`/${cate.slug}`}
                    // Thêm class 'active' nếu slug của danh mục này khớp với slug đang hiển thị trên URL
                    className={`navbar-link ${activeCategorySlug === cate.slug ? 'active' : ''}`}
                >
                    {cate.name}
                </Link>
            ))}
        </nav>
    );
}

export default Navbar;