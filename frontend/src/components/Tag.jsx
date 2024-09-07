import React, { useState } from "react";
import PropTypes from "prop-types";
import Text from "./Text";
import close from "../assets/close.svg";

const Tag = ({ text, onClick }) => {

  const handleClick = () => {
    // Toggle the active state when clicked
    onClick(text);
  };

  return (
    <div
      className={`px-4 py-2 flex flex-row items-center ease-in-out duration-200 rounded-full cursor-pointer bg-secondary`}
      onClick={handleClick}
    >
      <Text classNames="select-none" color={"white"}> {text}</Text> 
      <img src={close} alt="close" class="w-4 h-4 ml-4" />
    </div>
  );
};

Tag.propTypes = {
  text: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

export default Tag;
