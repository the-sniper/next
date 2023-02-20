function ArticleListByCategory({ articles, category }) {
  return (
    <>
      <h3>Showing news for {category}</h3>
      {articles.map((data, index) => (
        <div key={data.id}>
          <h4>{data.id}</h4>
          <h5>{data.title}</h5>
          <p>{data.description}</p>
          <hr />
        </div>
      ))}
    </>
  );
}

export default ArticleListByCategory;

export async function getServerSideProps(context) {
  const { params, req, res, query } = context;
  res.setHeader("Set-Cookie", ["name=Areef"]);
  const { category } = params;

  const response = await fetch(
    `http://localhost:3001/news?category=${category}`
  );
  const data = await response.json();

  return {
    props: {
      articles: data,
      category: category,
    },
  };
}
