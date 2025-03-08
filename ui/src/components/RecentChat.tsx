import { useMemo } from "react";
import { messageType } from "../types/fetchTypes";
import { TickIcon } from "./Icons";
import ProfilePic from "./ProfilePic";
import { extracteDateToOneWord } from "../utils/processDate";
import { msgStatusColor } from "./Message";
import { useUserStore } from "../store/userStore";

type Props = {
  img: string;
  name: string;
  msgQuantity: number;
  active: boolean;
  message: messageType | null;
};

export default function RecentChat({
  img,
  name,
  msgQuantity,
  active,
  message,
}: Props) {
  const { user } = useUserStore();
  const msgData = useMemo(() => initilizeMsg(message), [message]);
  const myMsg = useMemo(
    () => msgData.senderId === user?.id,
    [msgData, user?.id]
  );
  const msgStatus = useMemo(() => {
    if (myMsg || msgData.senderId === 0) {
      return true;
    }
    return msgData.seenBy.some((member) => member.user_id === user?.id);
  }, [msgData]);
  return (
    <div className="flex items-center gap-2">
      <ProfilePic image={img} active={active} size={50} circle={false} />
      <div className="flex grow justify-between items-center gap-2">
        <div>
          <p className="text-primary-text text-[17px] font-medium text-ellipsis max-w-[170px] whitespace-nowrap overflow-hidden">
            {name}
          </p>
          <p
            className={`${
              msgStatus ? "text-secondary-text" : "text-primary-text"
            } font-normal text-[15px] text-ellipsis max-w-[170px] whitespace-nowrap overflow-hidden`}
          >
            {user?.id === msgData.senderId ? "You: " : ""} {msgData.message}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-secondary-text text-[12px] block mb-2">
            {msgData.createdAt !== ""
              ? extracteDateToOneWord(msgData.createdAt)
              : ""}
          </span>
          {myMsg ? (
            <span className="flex items-center justify-end">
              <TickIcon color={msgStatusColor(msgData.status)} />
            </span>
          ) : (
            <span
              className={
                "flex mx-auto items-center justify-center w-[13px] h-[13px] rounded-full text-white bg-blue-color text-[8px] " +
                (msgQuantity == 0 ? "opacity-0" : "")
              }
            >
              {msgQuantity}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function initilizeMsg(msg: messageType | null): messageType {
  if (msg == null) {
    return {
      senderId: 0,
      message: "Say Hi",
      createdAt: "",
      conversationId: "",
      fileType: "text",
      fileLink: null,
      seenBy: [],
      removed: "none",
      status: "seen",
    };
  }
  return msg;
}
