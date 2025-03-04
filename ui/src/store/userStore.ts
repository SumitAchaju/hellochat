import { create } from "zustand";
import { userType } from "../types/fetchTypes";

interface userState {
  loginStatus: boolean;
  setLoginStatus: (status: boolean) => void;
  user: userType | undefined;
  setUser: (user: userType) => void;
}

export const useUserStore = create<userState>((set) => ({
  loginStatus: !!localStorage.getItem("access"),
  setLoginStatus: (status: boolean) => set({ loginStatus: status }),
  user: undefined,
  setUser: (user: userType) => set({ user }),
}));
