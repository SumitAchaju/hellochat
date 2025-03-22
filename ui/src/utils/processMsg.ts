import { messageType } from "../types/fetchTypes";
import { checkTimeDiff } from "./processDate";

export type dateType = {
  year: number;
  month: string;
  day: number;
  hour: number;
  minute: number;
  second: number;
  hour12: string;
};

export default function processMsg(msg: messageType[]) {
  let newMsg: any[] = [];
  msg.forEach((m, index) => {
    if (index == 0) {
      newMsg.push(addMsg(m));
      return;
    }
    let data = newMsg.pop();
    let latest_msg = data?.message.pop();
    if (data && latest_msg) {
      if (
        data?.senderId == m.senderId &&
        checkTimeDiff(latest_msg.created_at, m.createdAt, 60)
      ) {
        data.message.push(latest_msg);
        data.message.push(addInnerMsg(m));
        newMsg.push(data);
      } else {
        data.message.push(latest_msg);
        newMsg.push(data);
        newMsg.push(addMsg(m));
      }
    }
  });

  return newMsg;
}

export function addToProcessMsg(prevMsg: any[] | undefined, msg: messageType) {
  if (prevMsg === undefined) return prevMsg;
  let newMsg = structuredClone(prevMsg);
  let data = newMsg.pop();
  let latest_msg = data?.message.pop();
  if (data && latest_msg) {
    if (
      data.sender_id == msg.senderId &&
      checkTimeDiff(latest_msg.created_at, msg.createdAt, 60)
    ) {
      data.message.push(latest_msg);
      data.message.push(addInnerMsg(msg));
      newMsg.push(data);
    } else {
      data.message.push(latest_msg);
      newMsg.push(data);
      newMsg.push(addMsg(msg));
    }
  }
  return newMsg;
}

function addMsg(msg: messageType) {
  return {
    senderId: msg.senderId,
    message: [addInnerMsg(msg)],
    roomId: msg.conversationId,
  };
}

function addInnerMsg(msg: messageType) {
  return {
    id: msg._id,
    created_at: msg.createdAt,
    message_type: msg.fileType,
    file_links: msg.fileLink,
    status: msg.status,
    seen_by: msg.seenBy,
    message_text: msg.message,
  };
}
