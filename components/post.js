function Post({ posts }) {
  return (
    <>
      {/* {posts.map((data, index) => (
        <div key={data.id}> */}
      <h4>{posts.title}</h4>
      <p>{posts.body}</p>
      {/* </div>
      ))} */}
    </>
  );
}

export default Post;
