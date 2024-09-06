import React from "react";
import Text from "./Text";

const UserCard = ({name, majors, office, image}) => {
  return (
    <div class="p-8 gap-8 max-w-[450px] rounded-2xl shadow-lg flex ">
      <img class="w-full h-1/2" src={image} alt="User" />
      <div>
        <Text type="paragraph-strong">Name</Text>
        <Text classNames="mb-2" type="paragraph">{name}</Text>    
        <Text type="paragraph-strong">Majors</Text>
        <Text classNames="mb-2" type="paragraph">{majors}</Text>
        <Text type="paragraph-strong">Office</Text>
        <Text type="paragraph">{office}</Text>    
      </div>
    </div>
  );
};

export default UserCard;
