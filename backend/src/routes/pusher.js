const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { authenticateChannel } = require("../controllers/pusherController");

router.post("/auth", auth, authenticateChannel);

module.exports = router;
