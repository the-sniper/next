import Link from "next/link";

function PostList({ posts }) {
  return (
    <>
      <h1>Lists of posts</h1>
      {posts.map((data, index) => (
        <div key={data.id}>
          <h2>{data.title}</h2>
          <Link href={`/posts/${data.id}`}>View</Link>
          <hr />
        </div>
      ))}
    </>
  );
}
export default PostList;

export async function getStaticProps() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  return {
    props: {
      posts: data,
    },
  };
}
