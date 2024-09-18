import React, { useState } from "react";
import Text from "./Text";
import eyeoff from "./../assets/eye-off-svgrepo-com.svg";
import eyeon from "./../assets/eye-svgrepo-com.svg";

const CustomInput = ({
  label,
  placeholder,
  icon,
  classNames,
  onValueChange,
  value, // Accept the value prop
  type = "text",
  onMouseEnter,
  onMouseLeave,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const handleChange = (event) => {
    onValueChange(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={`flex flex-col ${classNames}`}>
      <Text classNames="mb-1" type="paragraph">
        {label}
      </Text>
      <div className="relative flex items-center">
        <input
          className="shadow appearance-none w-full bg-gray-200 rounded-2xl py-2 pl-3 pr-10 text-gray-950 leading-tight focus:outline-none focus:shadow-outline"
          type={type === "password" && !isPasswordVisible ? "password" : "text"}
          value={value} // Use the value prop directly
          onChange={handleChange}
          placeholder={placeholder}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
        {type === "password" && (
          <button
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            type="button"
          >
            <img
              src={isPasswordVisible ? eyeoff : eyeon}
              alt="Toggle Visibility"
              className="h-5 w-5 text-gray-600"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomInput;
