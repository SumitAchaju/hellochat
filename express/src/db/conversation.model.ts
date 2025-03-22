import mongoose from "mongoose";
import { formatDate } from "../utils/date.js";
import { MessageSchema } from "./message.model.js";

const ConversationSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["group", "direct"],
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: String,
    default: () => formatDate(new Date()),
  },
  members: [
    {
      userId: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ["admin", "member"],
        default: "member",
      },
      unRead: {
        type: Number,
        default: 0,
      },
    },
  ],
  lastMessage: MessageSchema,
});

ConversationSchema.index({
  "members.userId": 1,
});

ConversationSchema.index(
  {
    conversationId: 1,
  },
  { unique: true }
);

export const ConversationModel = mongoose.model(
  "Conversation",
  ConversationSchema
);
