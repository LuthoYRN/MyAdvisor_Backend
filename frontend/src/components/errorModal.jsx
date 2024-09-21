import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import Button from "./Button";
import Text from "./Text";

const ErrorModal = ({ isOpen, title, message, onContinue }) => {
  if (!isOpen) return null; // Do not render if the modal is not open
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div
        className="bg-white rounded-2xl p-8"
        style={{ width: "30%", maxWidth: "400px", minWidth: "300px" }}
      >
        <div className="flex flex-row items-center gap-2 mb-4 justify-center">
          <FaTimesCircle className="text-red-500 text-3xl" /> {/* Error Icon */}
          <Text type="sm-heading" classNames="text-center">
            {title}
          </Text>
        </div>

        <Text type="paragraph" classNames="mb-8 text-center">
          {message}
        </Text>
        <Button
          text="Continue"
          onClick={
            onContinue // Reopen the rejection modal
          }
        />
      </div>
    </div>
  );
};

export default ErrorModal;
