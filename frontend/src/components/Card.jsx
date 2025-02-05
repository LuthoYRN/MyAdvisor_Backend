import React from "react";
import Text from "./Text";

const Card = ({
  heading,
  info,
  side,
  classNames,
  active,
  onClick,
  appointmentCard = false,
  read = true,
  status,
  bottomText,
}) => {
  // Function to determine the background color
  const getBackgroundColor = () => {
    if (!status) {
      return "bg-white"; // Fallback to original white background if no status is provided
    }
    if (status === "Approval") {
      return active ? "bg-primary bg-opacity-20" : "bg-white";
    }
    if (status === "Rejection") {
      return active ? "bg-red-500 bg-opacity-40" : "bg-white";
    }
  };

  // Include condition for adding cursor pointer only if onClick is provided
  const containerClasses = `mt-1 mb-1 w-full h-24 p-4 flex flex-row justify-between rounded-2xl shadow-lg ${classNames} ${getBackgroundColor()} ${onClick ? "cursor-pointer" : ""} border-like-shadow`;
  return (
    <div className={containerClasses} onClick={onClick}>
      <div className="flex flex-col justify-between">
        <Text type="paragraph-strong">{heading}</Text>
        <Text
          type="paragraph"
          classNames={`${
            appointmentCard ? "underline text-gray-500 cursor-pointer" : ""
          }`}
        >
          {info}
        </Text>
      </div>
      <div className="flex flex-col justify-between items-end">
        <Text type="paragraph">{side}</Text>
        {!read && (
          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
        )}
        {
          <Text
            type="paragraph"
           >
            {bottomText}
          </Text>
        }
      </div>
    </div>
  );
};

export default Card;
