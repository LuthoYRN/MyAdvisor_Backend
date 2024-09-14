import React from "react";
import Text from "./Text";

const Card = ({ heading, info, side, classNames, active, onClick, read = true }) => {
  const containerClasses = `w-full h-24 p-4 flex flex-row justify-between rounded-2xl shadow-lg ${classNames} ${onClick && "cursor-pointer"} ${active ? "border-secondary border bg-secondary bg-opacity-5" : "bg-white"}`;

  return (
    <div className={containerClasses} onClick={onClick}>
      <div className="flex flex-col justify-between">
        <Text type="paragraph-strong">{heading}</Text>
        <Text type="paragraph">{info}</Text>
      </div>
      <div className="flex flex-col justify-between items-end">
        <Text type="paragraph">{side}</Text>
        {!read && (
          <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
        )}
      </div>
    </div>
  );
};

export default Card;
