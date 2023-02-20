function NewsArticleList({ articles }) {
  return (
    <>
      <h1>News article list</h1>
      {articles.map((data, index) => (
        <div key={data.id}>
          <h2>{data.id}</h2>
          <h3>{data.title}</h3>
          <h5>{data.category}</h5>
          <hr />
        </div>
      ))}
    </>
  );
}
export default NewsArticleList;

export async function getServerSideProps() {
  const response = await fetch("http://localhost:3001/news");
  const data = await response.json();

  return {
    props: {
      articles: data,
    },
  };
}
