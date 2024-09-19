import React from "react";
import Text from "./Text";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const DeleteModal = ({ status, message, returnMessage }) => {
  let navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white rounded-2xl p-8">
        <Text type="sm-heading" classNames="mb-4">
          {status ? status : "Confirm Delete"}
        </Text>
        <div className="flex max-w-64 flex-wrap">
          <Text classNames="mb-8">
            {message}
          </Text>
        </div>
        <div class="flex flex-row gap-4 mt-8">
          <Button
            text="Yes"
            type={"danger"}
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

export default DeleteModal;
