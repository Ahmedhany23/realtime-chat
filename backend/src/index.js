require("dotenv").config();
const express = require("express");
const setServers = require("node:dns/promises").setServers;
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");
const pusherRoutes = require("./routes/pusher");

setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/pusher", pusherRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
