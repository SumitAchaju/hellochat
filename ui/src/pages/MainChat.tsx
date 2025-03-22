import { useEffect } from "react";
import ChatHistory from "../components/chatpage/ChatHistory";
import MainChatBox from "../components/chatpage/MainChatBox";
import useNewWebsocket from "../hooks/useNewWebsocket";
import useOnMessageMain from "../hooks/useOnMessageMain";
import { useUserStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";

type Props = {};

export default function MainChat({}: Props) {
  const { onMessage } = useOnMessageMain();
  useNewWebsocket({ url: "/", onMessage: onMessage });

  const { loginStatus } = useUserStore();
  const go = useNavigate();

  useEffect(() => {
    if (!loginStatus) {
      go("/login");
    }
  }, [loginStatus]);

  return (
    <div className="flex h-screen">
      <div className="w-[400px] shrink-0 bg-second h-full">
        <ChatHistory />
      </div>
      <MainChatBox />
    </div>
  );
}
