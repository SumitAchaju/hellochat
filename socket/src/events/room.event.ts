import { Event } from "../decorators/event.js";
import { CustomSocket } from "../types.js";
import type { Server } from "socket.io";

const getConversationById = async (roomId: string) => {
  return {
    _id: roomId,
    members: [
      {
        userId: "user1",
        username: "user1",
      },
      {
        userId: "user2",
        username: "user2",
      },
    ],
  };
};

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
      return;
    }

    const room = await getConversationById(roomId);

    // check if room exists
    if (!room) {
      callback({ message: "Room not found", success: false });
      return;
    }

    // check if user is a member of the room
    if (!room.members.some((member) => member.userId === this.socket.userId)) {
      callback({
        message: "User is not a member of this room",
        success: false,
        room,
      });
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
  }

  @Event("room-message")
  async roomMessage(roomId: string, message: string) {
    if (!this.socket.rooms.has(roomId)) {
      this.socket.emit("error", "You are not connected to this room");
      return;
    }
    this.socket.to(roomId).emit("room-message", message);
  }

  @Event("leave-room")
  async leaveRoom(
    roomId: string,
    callback: (response: IRoomJoinedResponse) => void
  ) {
    await this.socket.leave(roomId);
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
