import React, { useEffect } from "react";
import Text from "./components/Text.jsx";
import Main from "./layout/Main.jsx";
import TextArea from "./components/TextArea.jsx";
import Button from "./components/Button.jsx";
import { useState } from "react";
import config from "./config.js";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ConfirmationModal from "./components/ConfirmationModal.jsx";

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
    console.log(location);
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
    <Main userType={"seniorAdvisor"}>
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
          <Button text="Back" type="secondary" />
        </div>
      </div>
      {showConfirmationModal && <ConfirmationModal status={"Success"} message={"Successfully saved notes"} onConfirm={"/advisorDashboard"}/>}
    </Main>
  );
};

export default MeetingNotes;
