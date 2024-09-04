import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Button from "./components/Button";
import video from "./assets/Video.svg";
import Pill from "./components/Pill";

/* 
Data Needed:
- Student Name
- Date
- Time
- Reason for Appointment
- Uploaded Documents

*/

const AppointmentDate = () => {
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
        <div class="flex gap-72 flex-auto">
          <div class="flex flex-col w-1/2 justify-between">
            <div></div>
            <div>
              <Button
                text="Book appointment"
                onClick={handleConfirmationModal}
              />
              <Button text="Back" type="secondary" />
            </div>
          </div>

          <div class="w-1/2 flex-auto">
            <Text type="sm-heading" classNames="mb-4">
              Available Times
            </Text>
            <div class="flex gap-4 mb-8">
              <Pill text="9:00 AM" />
              <Pill text="10:00 AM" />
              <Pill text="11:00 AM" />
            </div>
          </div>
        </div>
      </div>

      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8">
            <Text type="sm-heading" classNames="mb-4">
              Confirmation
            </Text>
            <Text type="sm-subheading" classNames="mb-8">
              Click confirm to finalize the appointment details{" "}
            </Text>
            <div className="grid grid-cols-2 gap-8 mb-4 max-w-96">
              <div>
                <Text type="paragraph-strong" classNames="mb-2">
                  Student Advisor
                </Text>
                <Text type="paragraph" classNames="mb-2">
                  John Doe
                </Text>
                <Text type="paragraph-strong" classNames="mb-2">
                  Date
                </Text>
                <Text type="paragraph" classNames="mb-2">
                  20 April 2024
                </Text>
                <Text type="paragraph-strong" classNames="mb-2">
                  Time
                </Text>
                <Text type="paragraph" classNames="mb-2">
                  4:20 PM
                </Text>
              </div>
              <div>
                <Text type="paragraph-strong" classNames="mb-2">
                  Major(s)
                </Text>
                <Text type="paragraph" classNames="mb-2">
                  Computer Science Business Computing
                </Text>
                <Text type="paragraph-strong" classNames="mb-2">
                  Office
                </Text>
                <Text type="paragraph" classNames="mb-2">
                  HPI Lab, 4th Floor, Hasso Plattner School of Design Thinking
                  Afrika
                </Text>
              </div>
            </div>
            <Button text="Confirm" onClick={handleCloseModal} />
          </div>
        </div>
      )}
    </Main>
  );
};

export default AppointmentDate;
