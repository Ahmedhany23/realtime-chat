const express = require("express");
const router = express.Router();
const {
  createRoom,
  getRooms,
  getRoomById,
  getRoomMessages,
  deleteRoom,
  createRoomMessage,
} = require("../controllers/roomController");
const auth = require("../middleware/auth");
const { createRoomSchema } = require("../schemas/room.schema");
const validate = require("../middleware/validate");

router.post("/", auth, validate(createRoomSchema), createRoom);
router.get("/", auth, getRooms);
router.get("/:id", auth, getRoomById);
router.get("/:id/messages", auth, getRoomMessages);
router.post("/:id/messages", auth, createRoomMessage);
router.delete("/:id", auth, deleteRoom);

module.exports = router;
