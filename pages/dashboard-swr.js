import useSWR from "swr";

const fetcher = async () => {
  const response = await fetch("http://localhost:3001/dashboard");
  const data = await response.json();
  return data;
};

function DashboardSWR() {
  const { data, error } = useSWR("dashboard", fetcher);

  if (error) return "An error occured";
  if (!data) return "Loading...";

  return (
    <div>
      <h4>Posts: {data?.posts}</h4>
      <h4>Likes: {data?.likes}</h4>
      <h4>Followers: {data?.followers}</h4>
      <h4>Following: {data?.following}</h4>
    </div>
  );
}

export default DashboardSWR;
