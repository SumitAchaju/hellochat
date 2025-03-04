import { Event } from "../decorators/event.js";
import { getConversationById } from "../../services/conversation.service.js";
import { CustomSocket } from "../types.js";
import logger from "../../utils/logger.js";
import type { Server } from "socket.io";

interface IRoomJoinedResponse {
  message: string;
  success: boolean;
  room?: Awaited<ReturnType<typeof getConversationById>>;
  error?: {
    message: string;
    location: string;
  }[];
}

class RoomEvent {
  constructor(private io: Server, private socket: CustomSocket) {}

  @Event("join-room")
  async joinRoom(
    roomId: string,
    callback: (response: IRoomJoinedResponse) => void
  ) {
    //check if user is already in the room
    if (this.socket.rooms.has(roomId)) {
      callback({
        message: "User is already in this room",
        success: false,
      });
      logger.error("User is already in this room");
      return;
    }

    const room = await getConversationById(roomId);

    // check if room exists
    if (!room) {
      callback({ message: "Room not found", success: false });
      logger.error(`Room ${roomId} not found`);
      return;
    }

    // check if user is a member of the room
    if (!room.members.some((member) => member.userId === this.socket.userId)) {
      callback({
        message: "User is not a member of this room",
        success: false,
        room,
      });
      logger.error("User is not a member of this room");
      return;
    }

    // join room
    this.socket.join(roomId);

    // ack of joining room
    callback({ message: "Joined room successfully", success: true, room });

    // send joined message to other member
    this.socket
      .to(roomId)
      .emit("room-message", `${this.socket.userId} joined the room`);

    logger.info(`User ${this.socket.userId} joined room ${roomId}`);
  }

  @Event("room-message")
  async roomMessage(roomId: string, message: string) {
    if (!this.socket.rooms.has(roomId)) {
      this.socket.emit("error", "You are not connected to this room");
      return;
    }
    this.socket.to(roomId).emit("room-message", message);
    logger.info(
      `User ${this.socket.userId} sent message to room ${roomId} message: ${message}`
    );
  }

  @Event("leave-room")
  async leaveRoom(
    roomId: string,
    callback: (response: IRoomJoinedResponse) => void
  ) {
    await this.socket.leave(roomId);
    logger.info(`User ${this.socket.userId} left room ${roomId}`);
    callback({ message: "Left room successfully", success: true });
  }

  @Event("online")
  async online(data: any, callback: (response: any[]) => void) {
    const onlineSocket = await this.io.fetchSockets();
    const onlineUsers = onlineSocket.map((socket) => socket.data);
    callback(onlineUsers);
  }
}

export default RoomEvent;
