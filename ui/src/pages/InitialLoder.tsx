import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import useAxios from "../hooks/useAxios";
import { useUserStore } from "../store/userStore";
import { relationUserType, userType } from "../types/fetchTypes";
import useThemeDetector from "../hooks/themeDetector";
import { systemThemeType, useThemeStore } from "../store/themeStore";
import useSocketStore from "../store/socketStore";
import setupSocket from "../utils/setupSocket";
import notify from "../components/toast/MsgToast";

type Props = {
  children: React.ReactNode;
};

export default function InitialLoder({ children }: Props) {
  // user
  const { loginStatus, setUser } = useUserStore();
  const api = useAxios();
  const userQuery = useQuery<userType>({
    queryKey: ["getUser"],
    queryFn: async () => {
      const userData = await api.get(`/django/api/v1/user/me/`);
      return userData.data;
    },
    enabled: loginStatus,
    retry: 2,
  });
  useEffect(() => {
    if (userQuery.data && userQuery.isSuccess) {
      setUser(userQuery.data);
    } else if (userQuery.isError) {
      notify("error", "Failed to fetch user data");
    }
  }, [userQuery.data]);

  //relation
  const { setRelation } = useUserStore();
  const relationQuery = useQuery<relationUserType>({
    queryKey: ["getRelation"],
    queryFn: async () => {
      const relationData = await api.get(`/django/api/v1/relation/me/`);
      return relationData.data;
    },
    enabled: loginStatus,
    retry: 2,
  });

  useEffect(() => {
    if (relationQuery.data) {
      setRelation(relationQuery.data);
    }
  }, [relationQuery.data]);

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

  //socket
  const { socket } = useSocketStore();
  useEffect(() => {
    return setupSocket(socket);
  }, [socket]);

  return children;
}
