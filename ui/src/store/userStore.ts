import { create } from "zustand";
import { relationUserType, userType } from "../types/fetchTypes";
import { jwtDecode } from "jwt-decode";

interface userState {
  loginStatus: boolean;
  setLoginStatus: (status: boolean) => void;
  user: userType | undefined;
  setUser: (user: userType) => void;
  relation: relationUserType | undefined;
  setRelation: (relation: relationUserType) => void;
  decodedToken: any;
  setDecodedToken: (token: any) => void;
}

export const useUserStore = create<userState>((set) => ({
  loginStatus: !!localStorage.getItem("access"),
  setLoginStatus: (status: boolean) => set({ loginStatus: status }),
  user: undefined,
  setUser: (user: userType) => set({ user }),
  relation: undefined,
  setRelation: (relation: relationUserType) => set({ relation }),
  decodedToken: !!localStorage.getItem("access")
    ? jwtDecode(localStorage.getItem("access") as string)
    : null,
  setDecodedToken: (token: any) => set({ decodedToken: token }),
}));
