import React from "react";

import { AiOutlineUser } from "react-icons/ai";
import { GoInbox } from "react-icons/go";
import { IoIosCog } from "react-icons/io";

export enum NotificationType {
  NEW_USER = "NEW_USER",
  NEW_ORDER = "NEW_ORDER",
  SETTING_UPDATE = "SETTING_UPDATE",
}

const NotificationIcon = {
  [NotificationType.NEW_USER]: AiOutlineUser,
  [NotificationType.NEW_ORDER]: GoInbox,
  [NotificationType.SETTING_UPDATE]: IoIosCog,
};

interface NotificationCardProps {
  type: NotificationType;
  title: string;
  date: string;
}

export const NotificationCard = ({ type, title, date }: NotificationCardProps) => {
  return (
    <div className="flex gap-x-2 p-2 hover:bg-neutral-100 rounded-md cursor-pointer">
      <div className="flex items-center justify-center h-5 w-5">
        {React.createElement(NotificationIcon[type])}
      </div>
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xs text-neutral-400">{date}</p>
      </div>
    </div>
  );
};
