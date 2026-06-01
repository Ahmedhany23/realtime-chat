require("dotenv").config();
const http = require("http");
const express = require("express");
const setServers = require("node:dns/promises").setServers;
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Message = require("./models/Message");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");
const Room = require("./models/Room");

setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.set("io", io);
const onlineUsers = new Set();

io.on("connection", (socket) => {
  const token = socket.handshake.auth.token;



  if (!token) {
    socket.emit("error", "Unauthorized");
    socket.disconnect();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // check if the user exists in the database
    User.findById(decoded.userId)
      .then((user) => {
        if (!user) {
          socket.emit("error", "User not found");
          socket.disconnect();
          return;
        }

        socket.data = {
          ...socket.data,
          userId: user._id.toString(),
          user: user,
        };

        console.log("user connected" + user.username);

        onlineUsers.add(socket.data.userId);

        io.emit("user-online", {
          userId: socket.data.userId,
          username: socket.data.user.username,
        });

        // join room

        socket.on("join-room", async (data) => {
          const roomId = data.roomId;
          if (!roomId) {
            socket.emit("error", "Room not found");
            return;
          }

          if (!socket.data.userId) {
            socket.emit(
              "error",
              "Authentication error: User not authenticated",
            );
            return;
          }

          try {
            const room = await Room.findById(roomId);

            if (!room) {
              socket.emit("error", "Room not found");
              return;
            }

            if (room.isPrivate) {
              const isMember = room.members?.some(
                (member) => member.toString() === socket.data.userId,
              );
              const isOwner = room.createdBy?.toString() === socket.data.userId;
              if (!isMember && !isOwner) {
                socket.emit("error", "You are not a member of this room");
                return;
              }

              await socket.join(roomId);
              socket.emit("joined-room", { roomId });
              console.log(
                `User ${socket.data.user.username} joined private room ${room.name}`,
              );
            } else {
              await socket.join(roomId);
              socket.emit("joined-room", { roomId });
              console.log(
                `User ${socket.data.user.username} joined public room ${room.name}`,
              );
            }
          } catch (error) {
            socket.emit(
              "error",
              "Error occurred while joining room: " + error.message,
            );
          }
        });

        socket.on("send-message", async (data) => {
          const { roomId, text } = data;

          if (!roomId) {
            socket.emit("error", "Room not found");
            return;
          }

          if (!text) {
            socket.emit("error", "Text not found");
            return;
          }

          if (!socket.data.userId) {
            socket.emit(
              "error",
              "Authentication error: User not authenticated",
            );
            return;
          }

          try {
            const message = await Message.create({
              room: roomId,
              user: socket.data.userId,
              text: text.trim(),
            });

            const populated = await Message.findById(message._id)
              .populate("user", "username displayName")
              .lean();

            io.to(roomId).emit("new-message", populated);
          } catch (error) {
            console.error("Error sending message:", error);
            socket.emit(
              "error",
              "Error occurred while sending message: " + error.message,
            );
          }
        });

      })
      .catch((err) => {
        socket.emit("error", "Authentication error: " + err.message);
        socket.disconnect();
      });
  } catch (error) {
    socket.emit("error", "Authentication error: " + error.message);
    socket.disconnect();
  }

  socket.on("disconnect", () => {
    if (socket.data.userId) {
      onlineUsers.delete(socket.data.userId);
      io.emit("user-offline", { userId: socket.data.userId });
    }
    console.log("user disconnected: " + socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
