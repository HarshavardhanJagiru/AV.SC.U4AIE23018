import { useEffect, useState } from "react";

function App() {

  const [notifications, setNotifications] =
    useState([]);

  const [filter, setFilter] =
    useState("All");

  useEffect(() => {

    async function fetchData() {

      try {

        const res = await fetch(
          "http://localhost:3000/notifications"
        );

        const data = await res.json();

        setNotifications(data);

      } catch (err) {
        console.log(err);
      }
    }

    fetchData();

  }, []);

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter(
        item => item.Type === filter
      );

  return (
    <div style={{ padding: "20px" }}>

      <h1>Notifications</h1>

      <select
        value={filter}
        onChange={(e) =>
          setFilter(e.target.value)
        }
      >
        <option value="All">All</option>
        <option value="Placement">
          Placement
        </option>
        <option value="Result">
          Result
        </option>
        <option value="Event">
          Event
        </option>
      </select>

      {filteredNotifications.map((item) => (

        <div
          key={item.ID}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <h3>{item.Type}</h3>

          <p>{item.Message}</p>

          <small>{item.Timestamp}</small>

        </div>
      ))}
    </div>
  );
}

export default App;