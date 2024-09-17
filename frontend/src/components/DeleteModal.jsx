import React from "react";
import Text from "./Text";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const ConfirmationModal = ({ status, message, returnMessage }) => {
  let navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white rounded-2xl p-8">
        <Text type="sm-heading" classNames="mb-4">
          Confirm Delete
        </Text>
        <Text type="sm-subheading" classNames="mb-8">
          {message}
        </Text>
        <div class="flex flex-row gap-4 mt-8">
          <Button
            text="Yes"
            onClick={() => {
              returnMessage("yes");
            }}
          />
          <Button
            text="No"
            onClick={() => {
              returnMessage("no");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
