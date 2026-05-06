// ===========================
// BACKEND - server.js
// ===========================

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const PORT = 3000;

// Mock notifications API response
const notifications = [
  {
    ID: "1",
    Type: "Result",
    Message: "Mid Exam Result",
    Timestamp: "2026-04-22 17:51:30",
  },
  {
    ID: "2",
    Type: "Placement",
    Message: "Google Hiring",
    Timestamp: "2026-04-22 17:52:30",
  },
  {
    ID: "3",
    Type: "Event",
    Message: "Tech Fest",
    Timestamp: "2026-04-22 17:50:30",
  },
  {
    ID: "4",
    Type: "Placement",
    Message: "Microsoft Hiring",
    Timestamp: "2026-04-22 17:49:30",
  },
];

// Priority Weights
const priorityMap = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

// API Route
app.get("/notifications", (req, res) => {
  try {
    let sortedNotifications = [...notifications];

    // Sort by Priority first
    // Then by latest Timestamp
    sortedNotifications.sort((a, b) => {
      const priorityDiff =
        priorityMap[b.Type] - priorityMap[a.Type];

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return (
        new Date(b.Timestamp) -
        new Date(a.Timestamp)
      );
    });

    // Top 10 notifications
    const topNotifications =
      sortedNotifications.slice(0, 10);

    res.json(topNotifications);
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});