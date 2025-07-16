import { useFetchArticles } from '../hooks/useFetchData';
import ArticleCard from '../components/ArticleCard';

function ArticleListPage() {
    const { articles, loading, error } = useFetchArticles();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    console.log('Articles fetched:', articles); 
    return (
        <div>
            {articles.map(article => (
                <ArticleCard key={article._id} article={article} />
            ))}
        </div>
    );
}

export default ArticleListPage;