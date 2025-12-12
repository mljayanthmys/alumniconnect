const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/alumni", require("./routes/alumni"));

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "🎓 AlumniConnect API is running!",
    version: "1.0.0",
    endpoints: {
      register: "POST /api/alumni/register",
      directory: "GET /api/alumni/directory",
      getAlumni: "GET /api/alumni/:id",
      update: "PUT /api/alumni/:id",
      delete: "DELETE /api/alumni/:id",
      stats: "GET /api/alumni/admin/stats",
      verify: "PATCH /api/alumni/:id/verify",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
