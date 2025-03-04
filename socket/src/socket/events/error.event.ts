import logger from "../../utils/logger.js";
import { Event } from "../decorators/event.js";
import { CustomSocket } from "../types.js";
import type { Server } from "socket.io";

class ErrorEvent {
  constructor(private io: Server, private socket: CustomSocket) {}

  @Event("error")
  public onError(error: any) {
    logger.error(String(error));
    this.socket.emit("error", error);
  }
}

export default ErrorEvent;
