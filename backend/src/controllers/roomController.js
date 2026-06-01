const Room = require("../models/Room");
const Message = require("../models/Message");

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

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  getRoomMessages,
  deleteRoom,
};
