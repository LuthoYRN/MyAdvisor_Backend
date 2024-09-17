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
  const [file, setFile] = React.useState(null);
  let location = useLocation();
  let navigate = useNavigate();

  const handleCommentChange = (value) => {
    setComment(value);
  };

  const handleContinue = () => {
    // Save the comment to the database
    console.log(comment);
    navigate("/appointmentDate", {
      state: { advisor: location.state, adviceRequired: comment, file: file },
    });
  };

  return (
    <Main userType={"student"} activeMenuItem={"bookAppointment"}>
      <div className="h-full flex flex-col flex-auto bg-white rounded-xl ">
        <div className="flex-auto  ml-6">
          <Text type="heading" classNames="mb-16 mt-10">
            Booking Appointment
          </Text>
          <Text type="sm-heading" classNames="mb-4">
            Student Advisor
          </Text>
          <Text type="paragraph" classNames="mb-8">
            {location.state.name}
          </Text>
          <div class="h-[500px] md:h-[400px] sm:h-[100px] flex gap-32 flex-auto">
            <div class="flex flex-col w-1/2 justify-between">
              <div class="flex-auto">
                <TextArea
                  label={"Comments"}
                  placeholder={"What advice is required?"}
                  onValueChange={handleCommentChange}
                ></TextArea>
              </div>
              <div class="flex flex-row gap-8">
                <Button text="Continue" onClick={handleContinue} />
                <Button
                  text="Back"
                  type="secondary"
                  onClick={() => navigate("/bookAppointment")}
                />
              </div>
            </div>

            <div class="w-1/2 flex flex-auto">
              <FileUploader handleFile={(uploadedFile)=> setFile(uploadedFile)} />
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Appointment;
