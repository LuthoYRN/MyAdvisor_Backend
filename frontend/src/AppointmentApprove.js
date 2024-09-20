import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import download from "./assets/download.svg";
import Button from "./components/Button";
import Text from "./components/Text";
import TextArea from "./components/TextArea";
import config from "./config";
import Main from "./layout/Main";

const AppointmentDetails = () => {
  const [showConfirmationModal, setShowConfirmationModal] = React.useState(false);
  const [showRejectionModal, setShowRejectionModal] = React.useState(false);
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [rejectedReason, setRejectedReason] = React.useState(null);

  let location = useLocation();
  let navigate = useNavigate();

  const handleAppointment = (status) => () => {
    // Check if rejecting and no reason is provided
    if (status === "reject" && (!rejectedReason || rejectedReason.trim() === "")) {
      setShowRejectionModal(false);  // Close rejection modal
      setShowErrorModal(true);       // Show error modal
      return;
    }

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
        if (response.ok) {
          // Show confirmation modal on success
          setShowConfirmationModal(true);
        } else {
          console.error("Failed to update appointment status");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
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
                {location.state.notificationDetails.studentName}
              </Text>
              <div className="flex flex-row gap-4 justify-between">
                <div>
                  <Text type="sm-heading" classNames="mb-4">
                    Date
                  </Text>
                  <Text type="paragraph" classNames="mb-8">
                    {location.state.notificationDetails.date}
                  </Text>
                </div>
                <div>
                  <Text type="sm-heading" classNames="mb-4">
                    Time
                  </Text>
                  <Text type="paragraph" classNames="mb-8">
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
                type="danger"
                onClick={() => setShowRejectionModal(true)}
              />
              <Button text="Back" type="secondary" onClick={() => navigate(-1)} />
            </div>
          </div>

          <div class="w-1/2 flex-auto">
            <Text type="sm-heading" classNames="mb-4">
              Uploaded Documents
            </Text>
            <div class="flex flex-wrap gap-4 mb-8">
              {location.state.notificationDetails.documents && location.state.notificationDetails.documents.length > 0 ? (
                location.state.notificationDetails.documents.map((document, index) => (
                  <a
                    key={index}
                    href={document.fileURL}
                    download
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="flex items-center justify-center p-8 flex-col rounded-2xl shadow-lg bg-gray-200 gap-4">
                      <img width={40} height={40} src={download} alt="file" />
                      <Text>{document.fileName}</Text>
                    </div>

                  </a>
                ))
              ) : (
                <Text type="paragraph">No files uploaded.</Text>

              )}
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

      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8" style={{ width: "30%", maxWidth: "400px", minWidth: "300px" }}>
            <div className="flex flex-row items-center gap-2 mb-4 justify-center">
              <FaTimesCircle className="text-red-500 text-3xl" /> {/* Error Icon */}
              <Text type="sm-heading" classNames="text-center">
                Error
              </Text>
            </div>

            <Text type="paragraph" classNames="mb-8 text-center">
              You cannot send a rejection without entering a message.
            </Text>
            <Button
              text="Continue"
              onClick={() => {
                setShowErrorModal(false);
                setShowRejectionModal(true);  // Reopen the rejection modal
              }}
            />
          </div>
        </div>
      )}
    </Main>
  );
};

export default AppointmentDetails;
