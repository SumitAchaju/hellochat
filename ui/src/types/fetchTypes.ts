export type msgStatusType = "seen" | "delivered" | "sent";
export type msgType = "text" | "video" | "image" | "document" | "links";

export type fetchErrorType = {
  detail: string;
};

export type userType = {
  id: number;
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  profile: string;
  contact_number_country_code: number;
  contact_number: number;
  username: string;
  blocked_user?: userType[];
  blocked_by?: userType[];
  friend?: userType[];
  friend_by?: userType[];
  requested_user?: userType[];
  requested_by?: userType[];
};

export type relationUserType = {
  id: number;
  user: userType;
  blocked: userType[];
  requested: userType[];
  friends: userType[];
};

export type onlineUserType = {
  user: userType;
  room: roomType;
};

export type roomUserType = {
  user_id: number;
  added_by: number | null;
  joined_at: string;
  isAdmin: boolean;
  id: string;
};

export type roomType = {
  _id: string;
  conversationId: string;
  name: string;
  type: "group" | "direct";
  active: boolean;
  createdAt: string;
  members: {
    userId: string;
    role: string;
    unRead: number;
  }[];
  lastMessage: messageType | null;
};

export type chatHistoryType = roomType;

export type innerMsgType = {
  msg_text: string;
  created_at: string;
};

export type messageType = {
  _id: string;
  senderId: number;
  conversationId: string;
  message: string;
  fileLink: string | null;
  fileType: "image" | "video" | "audio" | "document" | "text";

  seenBy: {
    user_id: number;
    seen_at: string;
  }[];

  status: "delivered" | "seen" | "sent";

  createdAt: string;
  removed: "none" | "all" | "self";
};

export type websocketResponseType = {
  event_type: "new_message" | "change_message_status" | "notification";
  data: messageType[] | notificationType[];
  sender_user: userType;
};

type notificationEnumType =
  | "friend_request"
  | "friend_request_accepted"
  | "friend_request_rejected"
  | "friend_request_canceled"
  | "block_friend"
  | "unblock_friend"
  | "unfriend";

type friendRequestExtraDataType = {
  is_active: boolean;
  is_canceled: boolean;
  is_accepted: boolean;
  is_rejected: boolean;
};

export type notificationType = {
  id: number;
  is_read: boolean;
  created_at: string;
  read_at: string;
  notification_type: notificationEnumType;
  message: string;
  sender_id: number;
  receiver_id: number;
  extra_data: friendRequestExtraDataType;
  linked_notification_id: number;
  sender_user?: userType;
  receiver_user?: userType;
  linked_notification?: notificationType;
};
