import mongoose from "mongoose";
import { formatDate } from "../utils/date.js";

export const MessageSchema = new mongoose.Schema({
  senderId: {
    type: Number,
    required: true,
  },
  conversationId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  fileLink: {
    type: String,
  },
  fileType: {
    type: String,
    enum: ["image", "video", "audio", "document", "text"],
    default: "text",
  },
  createdAt: {
    type: String,
    default: () => formatDate(new Date()),
  },
  removed: {
    type: String,
    enum: ["none", "all", "self"],
    default: "none",
  },
});

export const MessageModel = mongoose.model("Chat Message", MessageSchema);
