require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("rate-limiter-flexible");

const dishRoutes = require("./routes/dishRoutes");
const imageRoutes = require("./routes/imageRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiter
const opts = {
  points: 100, // Number of points
  duration: 60 * 60, // Per 1 hour
};
const limiter = new rateLimit.RateLimiterMemory(opts);

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "MealMind AI Backend is running!" });
});

// Routes
app.use("/api", dishRoutes);
app.use("/api", imageRoutes);
app.use("/api", mealPlanRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
