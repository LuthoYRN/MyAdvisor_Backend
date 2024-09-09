import React, { useState } from "react";
import PropTypes from "prop-types";
import Text from "./Text";

const Pill = ({ text, active, onClick }) => {

  const handleClick = () => {
    // Toggle the active state when clicked
    onClick(active);
  };

  return (
    <div
      className={`px-4 py-2 ease-in-out duration-200 rounded-2xl cursor-pointer  ${active ? "bg-secondary" : "bg-gray-200"}`}
      onClick={handleClick}
    >
      <Text classNames="select-none" color={active ? "white": "black"}> {text}</Text> 
    </div>
  );
};

Pill.propTypes = {
  text: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

export default Pill;
