import { create } from "zustand";
import io, { Socket } from "socket.io-client";

const socketUrl =
  process.env.REACT_APP_SOCKET_URL || "http://localhost/socket-io/";

type socketType = typeof Socket;

interface socketState {
  socket: socketType;
  setSocket: (socket: socketType) => void;
}

const useSocketStore = create<socketState>((set) => ({
  socket: io(socketUrl, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  }),
  setSocket: (socket: socketType) => set({ socket }),
}));

export default useSocketStore;
