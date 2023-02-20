import { useState } from "react";
import { useRouter } from "next/router";

function EventList({ eventList }) {
  const [events, setEvents] = useState(eventList);
  const router = useRouter();

  const fetchSportsEvents = async () => {
    const response = await fetch(
      "http://localhost:3001/events?category=sports"
    );
    const data = await response.json();
    setEvents(data);
    router.push("/events?category=sports", undefined, { shallow: true });
  };
  return (
    <>
      <h1>List of events</h1>
      <button onClick={fetchSportsEvents}>Sports Events</button>
      {events?.map((data, index) => (
        <div key={data.id}>
          <h3>
            {data.id} | {data.title} | {data.date} | {data.category}
          </h3>
          <p>{data.description}</p>
          <hr />
        </div>
      ))}
    </>
  );
}

export default EventList;

export async function getServerSideProps(context) {
  const { query } = context;
  console.log(query, "checkQuery");
  const { category } = query;
  const queryString = category ? "category=sports" : "";
  const response = await fetch(`http://localhost:3001/events?${queryString}`);
  const data = await response.json();

  return {
    props: {
      eventList: data,
    },
  };
}
