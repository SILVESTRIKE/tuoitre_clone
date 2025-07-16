// frontend/src/App.jsx
import React from 'react'; // useState không còn cần thiết ở đây nếu ArticleListPage tự lấy slug
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArticleListPage from './pages/ArticleListPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import Navbar from './components/Navbar'; // Import Navbar
import './App.css';

function App() {
    // Không cần state selectedCategorySlug ở đây nữa, vì ArticleListPage sẽ tự lấy từ URL
    // const [selectedCategorySlug, setSelectedCategorySlug] = useState(null);

    return (
        <Router>
            <div className="App">
                <Navbar /> {/* Navbar không cần truyền prop gì cả */}

                <Routes>
                    {/* Route cho trang chủ - hiển thị tất cả bài viết */}
                    <Route path="/" element={<ArticleListPage />} />

                    {/* Route cho danh mục - Lấy slug từ URL */}
                    <Route path="/:categorySlug" element={<ArticleListPage />} />

                    {/* Route cho chi tiết bài viết */}
                    <Route path="/slug/:slug" element={<ArticleDetailPage />} />

                    {/* Route cho trang không tìm thấy */}
                    <Route path="*" element={<div><h1>404 - Không tìm thấy trang</h1></div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;