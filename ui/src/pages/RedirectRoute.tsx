import { Navigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import Spinner from "../components/Spinner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { roomUrl } from "../utils/apiurl";
import { useUserStore } from "../store/userStore";

type Props = {};

export default function RedirectRoute({}: Props) {
  const { loginStatus } = useUserStore();

  if (!loginStatus) {
    return <Navigate to="/login" />;
  }

  const [roomId, setRoomId] = useState<string | null>(
    localStorage.getItem("roomId")
  );
  const api = useAxios();

  const initialRoomIdQuery = useQuery({
    queryKey: ["initialRoom"],
    queryFn: () =>
      api.get(roomUrl.initialRoom).then((res) => {
        console.log(res.data);
        setRoomId(res.data.conversationId);
        localStorage.setItem("roomId", "hello");
        return "hello";
      }),
    enabled: !roomId,
  });

  if (!roomId && initialRoomIdQuery.isLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <Navigate to={`/main/${roomId}`} />;
}
