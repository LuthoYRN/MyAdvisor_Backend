import React from "react";
import { FaTimesCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./components/Button";
import FileUploader from "./components/FileUploader";
import Text from "./components/Text";
import TextArea from "./components/TextArea";
import Main from "./layout/Main";

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
  const [showErrorModal, setShowErrorModal] = React.useState(false);

  let location = useLocation();
  let navigate = useNavigate();

  const handleCommentChange = (value) => {
    setComment(value);
  };

  const handleContinue = () => {
    if (!comment) {
      setShowErrorModal(true); // Show error modal if no comment is provided
    } else {
      // Proceed to the next step if the comment is entered
      navigate("/appointmentDate", {
        state: { advisor: location.state, adviceRequired: comment, file: file },
      });
    }
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
              <FileUploader handleFile={(uploadedFile) => setFile(uploadedFile)} />
            </div>
          </div>
        </div>
      </div>
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8 relative">
            <div className="flex flex-row items-center gap-2 mb-4">
              <FaTimesCircle className="text-red-500 text-3xl" />
              <Text type="sm-heading" classNames="text-center">
                Error
              </Text>
            </div>
            <Text type="sm-subheading" classNames="mb-8 text-xl">
              Please enter a reason for your booking before continuing.
            </Text>
            <Button
              text="Close"
              onClick={() => setShowErrorModal(false)} // Close the modal
            />
          </div>
        </div>
      )}
    </Main>
  );
};

export default Appointment;
