import { ConversationModel } from "../db/conversation.model.js";
import type { createMessage, messageType } from "./message.service.ts";

type conversationDataType = {
  conversationId: string;
  name?: string;
  type: "group" | "direct";
  members: {
    userId: string;
    role?: "admin" | "member";
  }[];
};

const createConversation = async (conversationData: conversationDataType) => {
  const conversation = new ConversationModel(conversationData);
  await conversation.save();
  return conversation.toObject();
};

const getAllConversation = async (offset?: number, limit?: number) => {
  const conversations = await ConversationModel.find()
    .sort({ createdAt: -1 })
    .skip(offset || 0)
    .limit(limit || 0)
    .exec();
  return conversations?.map((conversation) => conversation.toObject());
};

const getConversationById = async (conversationId: string) => {
  const conversation = await ConversationModel.findOne({ conversationId });
  return conversation?.toObject();
};

const getConversationByMembers = async (
  memberId: string,
  offset?: number,
  limit?: number
) => {
  const conversations = await ConversationModel.find({
    "members.userId": memberId,
  })
    .sort({ createdAt: -1 })
    .skip(offset || 0)
    .limit(limit || 0);
  return conversations?.map((conversation) => conversation.toObject());
};

const updateLastMessage = async (
  conversationId: string,
  message: Awaited<ReturnType<typeof createMessage>>
) => {
  const conversation = await ConversationModel.findOneAndUpdate(
    { conversationId },
    { lastMessage: message },
    { new: true }
  );
  return conversation?.toObject();
};

const disableConversation = async (conversationId: string) => {
  const conversation = await ConversationModel.findByIdAndUpdate(
    conversationId,
    { active: false },
    { new: true }
  );
  return conversation?.toObject();
};

export {
  createConversation,
  getAllConversation,
  getConversationById,
  getConversationByMembers,
  updateLastMessage,
  disableConversation,
};
