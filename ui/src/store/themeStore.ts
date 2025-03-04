import { create } from "zustand";

export type themeType = "dark" | "light";
export type systemThemeType = themeType | "system";

interface themeState {
  theme: themeType;
  setTheme: (theme: themeType) => void;
}

export const useThemeStore = create<themeState>((set) => ({
  theme: "dark",
  setTheme: (theme: themeType) => set({ theme }),
}));
