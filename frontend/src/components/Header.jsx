import React from "react";
import account from "../assets/account_circle.svg";
import notification from "../assets/notification.svg";
import Text from "./Text";
import { useNavigate } from "react-router-dom";

const Header = ({
  user,
  user_type,
  profile_url,
  info,
  subinfo,
  imgSrc,
  unreadCount,
}) => {
  let navigate = useNavigate();
  return (
    <div class="flex items-center h-full bg-white rounded-2xl shadow-xl mb-10">
      <img
        src={profile_url ? profile_url : account}
        alt="account"
        class="ml-4 rounded-full"
        width={80}
        height={80}
      />
      <div class="flex flex-col justify-center  p-4 ml-4 my-4 w-full h-5/6">
        <Text type="heading">{user}</Text>
        <Text type="m-subheading" classNames="mt-2 ">
          {info}
        </Text>
        <Text type="sm-subheading">{subinfo}</Text>
      </div>
      <div
        className="relative mr-12 cursor-pointer"
        onClick={() => {
          user_type
            ? navigate("/appointmentRequests")
            : navigate("/notifications");
        }}
      >
        <img src={notification} alt="notification" className="w-10 h-10" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  );
};

export default Header;
