import { Socket } from "socket.io-client";

export default function setupSocket(socket: typeof Socket) {
  socket.connect();

  socket.on("connect", () => {
    console.log("Socket connected");
  });
  return () => {
    socket.disconnect();
  };
}
