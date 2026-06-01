const { z } = require("zod");

const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required"),

  description: z
    .string()
    .optional(),

  isPrivate: z
    .boolean()
    .optional(),
});

module.exports = {
  createRoomSchema,
};