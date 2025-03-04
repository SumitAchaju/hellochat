import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import useAxios from "../hooks/useAxios";
import { userUrl } from "../utils/apiurl";
import { useUserStore } from "./userStore";
import { userType } from "../types/fetchTypes";
import useThemeDetector from "../hooks/themeDetector";
import { systemThemeType, useThemeStore } from "./themeStore";

type Props = {
  children: React.ReactNode;
};

export default function InitialLoder({ children }: Props) {
  // user
  const { loginStatus, setUser } = useUserStore();
  const api = useAxios();
  const userQuery = useQuery<userType>({
    queryKey: ["getUser"],
    queryFn: () => api.get(userUrl.getUser()).then((res) => res.data),
    enabled: loginStatus,
    retry: 2,
  });
  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
    }
  }, [userQuery.data]);

  // Theme
  const { setTheme } = useThemeStore();
  const isDarkTheme = useThemeDetector();

  const theme = useMemo(() => {
    const theme = localStorage.getItem("theme") as systemThemeType;
    const systemTheme = isDarkTheme ? "dark" : "light";
    if (theme) {
      document.body.classList.add(theme === "system" ? systemTheme : theme);
      return theme === "system" ? systemTheme : theme;
    } else {
      localStorage.setItem("theme", "system");
      document.body.classList.add(systemTheme);
      return systemTheme;
    }
  }, [isDarkTheme]);

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  return children;
}
