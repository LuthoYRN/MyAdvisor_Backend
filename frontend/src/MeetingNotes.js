import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./components/Button.jsx";
import Text from "./components/Text.jsx";
import TextArea from "./components/TextArea.jsx";
import config from "./config.js";
import Main from "./layout/Main.jsx";

/*
    Data Needed:
    - Save Meeting Notes
  */

const MeetingNotes = () => {
  const [notes, setNotes] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  let navigate = useNavigate();
  let location = useLocation();

  const handleSaveNotes = async () => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/appointment/${location.state}/note`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setShowConfirmationModal(true);
      }
    } catch (error) {
      console.error("There was an error saving the notes!", error);
    }
  };

  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
      }
    >
      <div class="flex flex-col flex-auto gap-8 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        <Text type="heading" classNames="mb-4">
          Meeting Notes
        </Text>
        <TextArea
          placeholder="Enter notes here"
          onValueChange={(value) => setNotes(value)}
        />
        <div class="flex flex-row gap-8 max-w-md">
          <Button text="Save" onClick={handleSaveNotes} />
          <Button text="Back" type="secondary" onClick={()=>navigate(-1)} />
        </div>
      </div>
      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8 relative">
            <div className="flex flex-row items-center gap-2 mb-4">
              <FaCheckCircle className="text-green-500 text-3xl" />
              <Text type="sm-heading" classNames="text-center">
                Success
              </Text>
            </div>
            <Text type="sm-subheading" classNames="mb-8 text-xl">
              Successfully saved notes
            </Text>
            <Button text="Close" onClick={() => navigate("/advisorDashboard")} />
          </div>
        </div>
      )}
    </Main>
  );
};

export default MeetingNotes;
