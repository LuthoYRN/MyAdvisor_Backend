import React from "react";
import Text from "./Text";

const Card = ({ heading, info, side, classNames, active, onClick }) => {
  if (active) {
    return (
      <div
        className={`w-full h-24  p-4 flex flex-row justify-between rounded-2xl border-secondary border bg-secondary bg-opacity-5 shadow-lg ${classNames} ${onClick && "cursor-pointer"}`}
        onClick={onClick}
      >
        <div className="flex flex-col justify-between">
          <Text type="paragraph-strong">{heading}</Text>
          <Text type="paragraph">{info}</Text>
        </div>
        <Text type="paragraph">{side}</Text>
      </div>
    );
  } else {
    return (
      <div
        className={`w-full h-24  p-4 flex flex-row justify-between rounded-2xl  bg-white shadow-lg ${classNames}`}
        onClick={onClick}
      >
        <div className="flex flex-col justify-between">
          <Text type="paragraph-strong">{heading}</Text>
          <Text type="paragraph">{info}</Text>
        </div>
        <Text type="paragraph">{side}</Text>
      </div>
    );
  }
};

export default Card;
