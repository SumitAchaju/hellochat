import Controller from "../decorators/controller.decorator.js";
import { Get, Post } from "../decorators/routes.decorator.js";
import type { Request, Response } from "express";
import {
  createConversation,
  getAllConversation,
  getConversationById,
  getConversationByMembers,
} from "../services/conversation.service.js";
import requireAuth from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validateZod.js";
import { createConversationSchema } from "../schemas/conversation.schema.js";
import NotFoundError from "../errors/notfound.error.js";
import { getLatestMessage } from "../services/message.service.js";

@Controller("/api/v1/conversation", [requireAuth("user")])
class Conversation {
  @Post("", [validateSchema(createConversationSchema)])
  async createConversation(req: Request, res: Response) {
    const data = await createConversation(req.body);
    res.status(200).json(data).end();
  }

  @Get("/all")
  async getAllConversation(req: Request, res: Response) {
    const { offset, limit } = req.query;
    const newOffset = parseInt(offset as string) || 0;
    const newLimit = parseInt(limit as string) || 0;
    const groupRooms = await getAllConversation(newOffset, newLimit);
    res.status(200).json(groupRooms).end();
  }

  @Get("/:id")
  async getConversationById(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      throw new NotFoundError("id", "Request Params");
    }
    const conversation = await getConversationById(id);
    if (!conversation) {
      throw new NotFoundError("Conversation");
    }
    res.status(200).json(conversation).end();
  }

  @Get("/history")
  async getConversationByMembers(req: Request, res: Response) {
    const userId = req.user?.user_id;
    const { offset, limit } = req.query;
    const newOffset = parseInt(offset as string) || 0;
    const newLimit = parseInt(limit as string) || 0;
    const data = await getConversationByMembers(userId, newOffset, newLimit);
    res.status(200).json(data).end();
  }

  @Get("/initialRoom")
  async getInitialRoom(req: Request, res: Response) {
    const userId = req.user?.user_id;

    const latestMsg = await getLatestMessage(userId);
    const room = await getConversationById(latestMsg?.conversationId || "");
    res.status(200).json(room).end();
  }
}

export default Conversation;
