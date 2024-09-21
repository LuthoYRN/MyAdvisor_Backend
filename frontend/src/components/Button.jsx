import React from "react";
import Text from "./Text";

// Simple spinner component
const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white mx-auto"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8V12H4z"
    ></path>
  </svg>
);

const Button = ({ text, onClick, type, disabled, style, loading }) => {
  let buttonClassName = "";

  const handleOnclick = (event) => {
    event.preventDefault();
    if (!loading && onClick) {
      onClick(event);
    }
  };

  switch (type) {
    case "primary":
      buttonClassName =
        "bg-blue-950 rounded-2xl w-full h-10 text-center p-2 my-2";
      break;
    case "secondary":
      buttonClassName =
        "border border-black rounded-2xl w-full h-10 text-center p-2 my-2";
      break;
    case "danger":
      buttonClassName =
        "bg-red-600 rounded-2xl w-full h-10 text-center p-2 my-2";
      break;
    default:
      buttonClassName =
        "bg-blue-950 rounded-2xl w-full h-10 text-center p-2 my-2";
      break;
  }

  if (disabled || loading) {
    buttonClassName += " opacity-50 cursor-not-allowed";
  }

  return (
    <button
      className={buttonClassName}
      style={style}
      onClick={handleOnclick}
      disabled={disabled || loading}
    >
      {/* If loading is true, show the spinner; otherwise, show the text */}
      {loading ? (
        <Spinner />
      ) : (
        <Text
          type="paragraph"
          color={disabled ? "gray" : type === "secondary" ? "black" : "white"}
        >
          {text}
        </Text>
      )}
    </button>
  );
};

export default Button;
