import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Button from "./components/Button";
import video from "./assets/Video.svg";
import FileUploader from "./components/FileUploader";
import TextArea from "./components/TextArea";

/* 
Data Needed:
- Student Name
- Date
- Time
- Reason for Appointment
- Uploaded Documents

*/

const Appointment = () => {
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [value, onChange] = React.useState();

  const handleConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
  };

  return (
    <Main>
      <div className="flex flex-col flex-auto">
        <Text type="heading" classNames="mb-16">
          Appointment Details
        </Text>
        <Text type="sm-heading" classNames="mb-4">
          Student Advisor
        </Text>
        <Text type="paragraph" classNames="mb-8">
          {/* Replace the placeholder tex with the actual name*/}
          John Doe
        </Text>
        <div class="flex gap-64 flex-auto">
          <div class="flex flex-col w-1/2 justify-between">
            <div class="flex-auto">
              <TextArea label={"Comments"} placeholder={"What advice is required?"}></TextArea>
            </div>
            <div class="flex flex-row gap-8">
              <Button text="Continue"/>
              <Button text="Back" type="secondary" />
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
