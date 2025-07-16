export async function fetchArticles() {
    const response = await fetch('http://localhost:4000/api/articles'); // Đổi URL cho đúng backend
    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
}