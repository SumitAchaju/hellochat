import { MessageModel } from "../db/message.model.js";

export type messageType = {
  senderId: Number;
  conversationId: String;
  message?: String;
  fileLink?: String;
  fileType: "image" | "video" | "audio" | "document" | "text";
  createdAt?: String;
  removed?: "none" | "all" | "self";
};

const createMessage = async (messageData: messageType) => {
  const message = new MessageModel(messageData);
  await message.save();
  return message.toObject();
};

const getMessagesByConversationId = async (
  conversationId: string,
  offset?: number,
  limit?: number
) => {
  const messages = await MessageModel.find({ conversationId })
    .skip(offset || 0)
    .limit(limit || 0)
    .exec();
  return messages?.map((message) => message.toObject());
};

const getLatestMessage = async (userId: number) => {
  const message = await MessageModel.findOne({
    senderId: userId,
  })
    .sort({ createdAt: -1 })
    .exec();
  return message?.toObject();
};

export { createMessage, getMessagesByConversationId, getLatestMessage };
