const Room = require("../models/Room");
const pusher = require("../lib/pusher");

const authenticateChannel = async (req, res) => {
  try {
    const payload = req.body || {};
    const socketId = payload.socket_id || req.query.socket_id;
    const channelName = payload.channel_name || req.query.channel_name;

    if (!socketId || !channelName) {
      return res.status(400).json({ error: "Missing socket or channel data" });
    }

    const roomMatch = channelName.match(/^private-room-(.+)$/);
    if (!roomMatch) {
      return res.status(400).json({ error: "Invalid channel" });
    }

    const roomId = roomMatch[1];
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

    return res.json(pusher.authorizeChannel(socketId, channelName));
  } catch (error) {
    console.error("Error authorizing pusher channel:", error);
    return res.status(500).json({
      error: "Error occurred while authorizing pusher channel",
    });
  }
};

module.exports = { authenticateChannel };
