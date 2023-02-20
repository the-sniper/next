import Head from "next/head";
import User from "../../components/user";

function UserList({ users }) {
  return (
    <>
      <Head>
        <meta property="og:title" content="Title test SEO" />
        <meta property={users[0].name} content={users[0].email} />
      </Head>
      <h2>Users</h2>
      <p>{users[0].id}</p>
      <p>{users[0].email}</p>
      <p>{users[0].name}</p>
      {/* <User users={users} /> */}
    </>
  );
}

export default UserList;

export async function getServerSideProps() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await response.json();
  return {
    props: {
      users: data,
    },
  };
}
