import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./components/Button";
import Text from "./components/Text";
import TextArea from "./components/TextArea";
import config from "./config";
import Main from "./layout/Main";

const AppointmentDetails = () => {
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [showRejectionModal, setShowRejectionModal] = React.useState(false);
  const [rejectedReason, setRejectedReason] = React.useState(null);
  let location = useLocation();
  let navigate = useNavigate();

  const handleAppointment = (status) => () => {
    fetch(
      `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/requests/${location.state.requestID}?action=${status}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rejectionMessage: rejectedReason,
        }),
      }
    )
      .then((response) => {
        console.log("response", response);
        if (response.ok) {
          // Show confirmation modal
          console.log("Appointment status updated successfully");
          setShowConfirmationModal(true);
        } else {
          console.log("Failed to update appointment status");
        }
      })
      .catch((error) => {
        // handle the error
        console.log("Error:", error);
      });
  };

  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
      }
      activeMenuItem={"notifications"}
    >
      <div className="flex flex-col flex-auto p-8 rounded-2xl bg-white shadow-xl">
        <Text type="heading" classNames="mb-16">
          Appointment Details
        </Text>
        <div class="flex gap-72 flex-auto">
          <div class="flex flex-col w-1/2 justify-between">
            <div>
              <Text type="sm-heading" classNames="mb-4">
                Student
              </Text>
              <Text type="paragraph" classNames="mb-8">
                {/* Replace the placeholder tex with the actual name*/}
                {location.state.notificationDetails.studentName}
              </Text>
              <div className="flex flex-row gap-4 justify-between">
                <div>
                  <Text type="sm-heading" classNames="mb-4">
                    Date
                  </Text>
                  <Text type="paragraph" classNames="mb-8">
                    {/* Replace the placeholder tex with the actual date*/}
                    {location.state.notificationDetails.date}
                  </Text>
                </div>
                <div>
                  <Text type="sm-heading" classNames="mb-4">
                    Time
                  </Text>
                  <Text type="paragraph" classNames="mb-8">
                    {/* Replace the placeholder tex with the actual time*/}
                    {location.state.notificationDetails.time}
                  </Text>
                </div>
              </div>
              <Text type="sm-heading" classNames="mb-4">
                Reason for Appointment
              </Text>
              <Text type="paragraph" classNames="mb-8">
                {location.state.notificationDetails.comment}
              </Text>
            </div>
            <div>
              <Button text="Approve" onClick={handleAppointment("approve")} />
              <Button
                text="Reject"
                type="secondary"
                style={{
                  backgroundColor: "red", // Lighter red
                  opacity: 0.9,
                  color: "white", // Ensures the text is white for better readability
                  border: "2px solid white", // Adds a 2px solid white border
                }}
                onClick={() => setShowRejectionModal(true)}
              />
              <Button text="Back" type="secondary" />
            </div>
          </div>

          <div class="w-1/2 flex-auto">
            <Text type="sm-heading" classNames="mb-4">
              Uploaded Documents
            </Text>
            <div class="flex gap-4 mb-8">
              {/* Replace the placeholder image with the actual document image*/}
              <div>
                <img src="https://via.placeholder.com/150" alt="Student" />
                <Text type="paragraph" classNames="text-center mt-2">
                  Document 1
                </Text>
              </div>
              <div>
                <img src="https://via.placeholder.com/150" alt="Student" />
                <Text type="paragraph" classNames="text-center mt-2">
                  Document 2
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8">
            <div className="flex flex-row items-center gap-2 mb-4">
              <FaCheckCircle className="text-green-500 text-3xl" />
              <Text type="sm-heading" classNames="text-center">
                Success
              </Text>
            </div>

            <Text type="sm-subheading" classNames="mb-8 text-xl">
              Appointment status updated successfully
            </Text>
            <Button
              text="Close"
              onClick={() => {
                setShowConfirmationModal(false);
                navigate("/advisorDashboard");
              }}
            />
          </div>
        </div>
      )}

      {showRejectionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8 relative">
            <Text type="sm-heading" classNames="mb-4">
              Enter reason for rejection
            </Text>
            <TextArea
              placeholder="Enter reason for rejection"
              onValueChange={(value) => setRejectedReason(value)}
            />
            <div class="flex flex-row gap-4 mt-8">
              <Button
                text="Cancel"
                type="secondary"
                onClick={() => setShowRejectionModal(false)}
              />
              <Button
                text="Send"
                onClick={() => {
                  handleAppointment("reject")();
                  setShowRejectionModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Main>
  );
};

export default AppointmentDetails;
