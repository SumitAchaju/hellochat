import type { Request, Response } from "express";
import {
  createMessage,
  getMessagesByConversationId,
} from "../services/message.service.js";
import Controller from "../decorators/controller.decorator.js";
import { Get, Post } from "../decorators/routes.decorator.js";
import _ from "lodash";
import requireAuth from "../middlewares/auth.js";
import NotFoundError from "../errors/notfound.error.js";
import { updateLastMessage } from "../services/conversation.service.js";

@Controller("/api/v1/message", [requireAuth("user")])
class Message {
  @Post("/:conversationId")
  async createMessage(req: Request, res: Response) {
    const { conversationId } = req.params;
    if (!conversationId) {
      throw new NotFoundError("conversationId", "Request Params");
    }
    const msg = req.body;
    msg.conversationId = conversationId;
    const newMsg = await createMessage(msg);
    const room = await updateLastMessage(conversationId, newMsg);
    if (!room) {
      throw new NotFoundError("Room", "Conversation");
    }

    res.status(200).json(newMsg).end();
  }

  @Get("/:conversationId")
  async getMessageByConversationId(req: Request, res: Response) {
    const { conversationId } = req.params;
    const { offset, limit } = req.query;

    const newOffset = parseInt(offset as string) || 0;
    const newLimit = parseInt(limit as string) || 0;

    const message = await getMessagesByConversationId(
      conversationId || "",
      newOffset,
      newLimit
    );
    if (_.isEmpty(message)) {
      throw new NotFoundError("Message", "Conversation");
    }
    res.status(200).json(message).end();
  }
}

export default Message;
