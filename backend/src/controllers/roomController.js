const Room = require("../models/Room");
const Message = require("../models/Message");
const pusher = require("../lib/pusher");

const createRoom = async (req, res) => {
  try {
    const isPrivate = Boolean(req.body.isPrivate)
    const room = await Room.create({
      ...req.body,
      isPrivate,
      createdBy: req.user._id,
      members: isPrivate ? [req.user._id] : req.body.members ?? [],
    });

    const populatedRoom = await Room.findById(room._id)
      .populate("createdBy", "username displayName")
      .lean();

    res.status(201).json(populatedRoom);
  } catch (error) {
    console.error("Error creating room:", error);

    return res.status(500).json({
      error: "Error occurred while creating room",
    });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("createdBy", "username displayName")
      .sort({ createdAt: -1 })
      .lean();

    res.json(rooms);
  } catch (error) {
    console.error("Error getting rooms:", error);
    return res
      .status(500)
      .json({ error: "Error occurred while getting rooms" });
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate("createdBy", "username displayName")
      .lean();

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    console.error("Error getting room:", error);
    return res.status(500).json({ error: "Error occurred while getting room" });
  }
};
const getRoomMessages = async (req, res) => {
  try {
    const roomId = req.params.id;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const skip = parseInt(req.query.skip) || 0;

    const messages = await Message.find({ room: roomId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username displayName")
      .lean();

    res.json(messages);
  } catch (error) {
    console.error("Error getting room messages:", error);
    return res
      .status(500)
      .json({ error: "Error occurred while getting room messages" });
  }
};

const deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    return res
      .status(500)
      .json({ error: "Error occurred while deleting room" });
  }
};

const createRoomMessage = async (req, res) => {
  try {
    const roomId = req.params.id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text not found" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.isPrivate) {
      const isMember = room.members?.some(
        (member) => member.toString() === req.user._id.toString(),
      );
      const isOwner = room.createdBy?.toString() === req.user._id.toString();

      if (!isMember && !isOwner) {
        return res.status(403).json({ error: "You are not a member of this room" });
      }
    }

    const message = await Message.create({
      room: roomId,
      user: req.user._id,
      text: text.trim(),
    });

    const populated = await Message.findById(message._id)
      .populate("user", "username displayName")
      .lean();

    await pusher.trigger(`private-room-${roomId}`, "new-message", populated);

    return res.status(201).json(populated);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      error: "Error occurred while sending message: " + error.message,
    });
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  getRoomMessages,
  deleteRoom,
  createRoomMessage,
};
