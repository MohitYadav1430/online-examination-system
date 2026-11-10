const express = require("express");
const cors = require("cors");
const path = require("path");

const examRoutes = require("./routes/examRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

// Load environment variables
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Online Examination System API is running!",
  });
});

// Test Route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend connection successful!",
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

   app.listen(PORT, "0.0.0.0", () => {
     console.log(`Server running on port ${PORT}`);
   });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();