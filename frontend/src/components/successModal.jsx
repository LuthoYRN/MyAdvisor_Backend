import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import Button from "./Button";
import Text from "./Text";

const SuccessModal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null; // Do not render if the modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white rounded-2xl p-8">
        <div className="flex flex-row items-center gap-2 mb-4">
          <FaCheckCircle className="text-green-500 text-3xl" />
          <Text type="sm-heading" classNames="text-center">
            {title}
          </Text>
        </div>

        <Text type="sm-subheading" classNames="mb-8 text-xl">
          {message}
        </Text>

        <Button text="Close" onClick={onClose} />
      </div>
    </div>
  );
};

export default SuccessModal;
