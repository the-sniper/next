import User from "../../components/user";

function UserList({ users }) {
  return (
    <>
      <h2>Users</h2>
      <User users={users} />
    </>
  );
}

export default UserList;

export async function getStaticProps() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await response.json();
  return {
    props: {
      users: data,
    },
  };
}
