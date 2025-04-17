require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const testRoutes = require("./routes/testRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const forumRoutes = require("./routes/forumRoutes");
const webinarRoutes = require("./routes/webinarRoutes");
const statsRoutes = require("./routes/statsRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Подключение маршрутов
app.get("/", (req, res) => {
  res.send("STEM LMS API is running!");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/webinars", webinarRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;
