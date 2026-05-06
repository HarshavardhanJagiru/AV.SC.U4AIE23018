const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Allows your React app to communicate with this server
app.use(express.json());

// Logging Middleware (Mandatory for your test)
const loggingMiddleware = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
};
app.use(loggingMiddleware);

// Sample Route for Stage 6 logic
app.get('/api/priority-notifications', async (req, res) => {
    // Implement the weight-based sorting here
    res.json({ message: "Sorted notifications would go here" });
});

app.listen(5000, () => console.log('Server running on port 5000'));