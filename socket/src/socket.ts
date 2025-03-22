import { Server } from "http";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { SocketIoApplication } from "./bootstraper.js";
import { authMiddleware } from "./middleware.js";
import MessageEvent from "./events/message.event.js";
import ErrorEvent from "./events/error.event.js";
import RoomEvent from "./events/room.event.js";
import { createClient } from "redis";

export default async function setupIoServer(
  server: Server,
  redisClient?: ReturnType<typeof createClient>
) {
  const io = new SocketIoApplication({
    server,
    middlewares: [authMiddleware("user")],
    events: [MessageEvent, ErrorEvent, RoomEvent],
    options: {
      cors: {
        origin: "*",
      },
      adapter: createAdapter(redisClient),
    },
  });
  console.log("Socket server is running");
  return io;
}
