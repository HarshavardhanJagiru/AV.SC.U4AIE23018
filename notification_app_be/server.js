const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3000;

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhdi5zYy51NGFpZTIzMDE4QGF2LnN0dWRlbnRzLmFtcml0YS5lZHUiLCJleHAiOjE3NzgwNjAzODQsImlhdCI6MTc3ODA1OTQ4NCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjkyNzlhMTAzLTExODYtNGJmYy1hODk1LThhODBjZjdmN2UzMiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImphZ2lydSBoYXJzaGEgdmFyZGhhbiIsInN1YiI6ImViZDhkN2YzLWNjZTctNDhmYy1hMzE4LWYxYzcxOTc4ZWMyMSJ9LCJlbWFpbCI6ImF2LnNjLnU0YWllMjMwMThAYXYuc3R1ZGVudHMuYW1yaXRhLmVkdSIsIm5hbWUiOiJqYWdpcnUgaGFyc2hhIHZhcmRoYW4iLCJyb2xsTm8iOiJhdi5zYy51NGFpZTIzMDE4IiwiYWNjZXNzQ29kZSI6IlBUQk1tUSIsImNsaWVudElEIjoiZWJkOGQ3ZjMtY2NlNy00OGZjLWEzMTgtZjFjNzE5NzhlYzIxIiwiY2xpZW50U2VjcmV0IjoiVnlnZnF1U2h2RVhxSFlyTiJ9.E34K8liu9klmzDOl0-Km1maTB2usVHXROsJIVZl9wBU";


// ----------------------------------
// LOG FUNCTION
// ----------------------------------

async function Log(stack, level, packageName, message) {

  try {

    const response = await fetch(
      "http://20.207.122.201/evaluation-service/logs",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },

        body: JSON.stringify({
          stack,
          level,
          package: packageName,
          message,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

  } catch (err) {
    console.log("Log failed");
  }
}

// ----------------------------------
// LOGGING MIDDLEWARE
// ----------------------------------

app.use(async (req, res, next) => {

  await Log(
    "backend",
    "info",
    "middleware",
    `${req.method} ${req.url}`
  );

  next();
});

// ----------------------------------
// FETCH NOTIFICATIONS
// ----------------------------------

app.get("/notifications", async (req, res) => {

  try {

    const response = await fetch(
      "http://20.207.122.201/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    const data = await response.json();

    const notifications = data.notifications;

    const priorityMap = {
      Placement: 3,
      Result: 2,
      Event: 1,
    };

    notifications.sort((a, b) => {

      const priorityDiff =
        priorityMap[b.Type] -
        priorityMap[a.Type];

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return (
        new Date(b.Timestamp) -
        new Date(a.Timestamp)
      );
    });

    const top10 = notifications.slice(0, 10);

    await Log(
      "backend",
      "info",
      "handler",
      "Top 10 notifications fetched"
    );

    res.json(top10);

  } catch (err) {

    await Log(
      "backend",
      "error",
      "handler",
      err.message
    );

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});