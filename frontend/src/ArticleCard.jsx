function ArticleCard({ article }) {
  return (
    <div className="card">
      <img src={article.image} alt={article.title} />
      <h2>{article.title}</h2>
      <p>{article.sapo}</p>
    </div>
  );
}
export default ArticleCard;