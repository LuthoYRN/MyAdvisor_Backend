import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Button from "./components/Button";
import video from "./assets/Video.svg";
import FileUploader from "./components/FileUploader";
import TextArea from "./components/TextArea";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

/* 
Data Needed:
- Student Name
- Date
- Time
- Reason for Appointment
- Uploaded Documents

*/

const Appointment = () => {
  const [comment, setComment] = React.useState("");
  let location = useLocation();
  let navigate = useNavigate();
 
  const handleCommentChange = (value) => {
    setComment(value);
  }

  const handleContinue = () => {
    // Save the comment to the database
    console.log(comment);
    navigate("/appointmentDate");
  }

  return (
    <Main userType={"student"} activeMenuItem={"bookAppointment"}>
      <div className="flex flex-col flex-auto">
        <Text type="heading" classNames="mb-16">
          Appointment Details
        </Text>
        <Text type="sm-heading" classNames="mb-4">
          Student Advisor
        </Text>
        <Text type="paragraph" classNames="mb-8">
        {location.state.name}
        </Text>
        <div class="flex gap-64 flex-auto">
          <div class="flex flex-col w-1/2 justify-between">
            <div class="flex-auto">
              <TextArea label={"Comments"} placeholder={"What advice is required?"} onValueChange={handleCommentChange}></TextArea>
            </div>
            <div class="flex flex-row gap-8">
              <Button text="Continue" onClick={handleContinue}/>
              <Button text="Back" type="secondary" onClick={() => navigate("/bookAppointment")} />
            </div>
          </div>

          <div class="w-1/2 flex flex-auto">
            <FileUploader />
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Appointment;
