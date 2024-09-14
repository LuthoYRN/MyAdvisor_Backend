import React from "react";
import Text from "./Text";

const UserCard = ({ name, majors, office, image, active, onClick }) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`p-8 gap-8 max-w-[450px] max-h-64 rounded-2xl shadow-lg flex transition-transform transform ${active ? "border-secondary border bg-secondary bg-opacity-5 shadow-lg" : ""} cursor-pointer hover:scale-105 hover:shadow-xl`}
    >
      <img className="w-24 h-24 rounded-full" src={image} alt="User" />
      <div>
        <Text type="paragraph-strong">Name</Text>
        <Text classNames="mb-2" type="paragraph">
          {name}
        </Text>
        <Text type="paragraph-strong">Majors</Text>
        <Text classNames="mb-2" type="paragraph">
          {majors}
        </Text>
        <Text type="paragraph-strong">Office</Text>
        <Text type="paragraph">{office}</Text>
      </div>
    </div>
  );
};

export default UserCard;
