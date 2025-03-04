import { Event } from "../decorators/event.js";
import { CustomSocket } from "../types.js";
import type { Server } from "socket.io";

class MessageEvent {
  constructor(private io: Server, private socket: CustomSocket) {}

  @Event("message")
  public async onMessage(message: string) {
    this.socket.emit("message", message);
  }

  @Event("typing")
  public async onTyping(roomId: string) {
    this.socket.to(roomId).emit("typing", this.socket.userId);
  }
}

export default MessageEvent;
