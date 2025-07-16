import { useEffect, useState } from 'react';
import { fetchArticles } from '../services/apiService';

export function useFetchArticles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticles()
            .then(data => setArticles(data))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, []);

    return { articles, loading, error };
}