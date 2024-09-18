import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Button from "./components/Button";
import video from "./assets/Video.svg";
import moment from "moment";
import { useLocation } from "react-router-dom";
import config from "./config";
import { useNavigate } from "react-router-dom";
import download from "./assets/download.svg";


const AppointmentDetails = () => {
  const [showRecordingModal, setShowRecordingModal] = React.useState(false);
  const [appointment, setAppointment] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  let location = useLocation();
  let navigate = useNavigate();

  const handleRecordMeeting = () => {
    setShowRecordingModal(true);
  };

  const handleCloseModal = () => {
    setShowRecordingModal(false);
  };

  React.useEffect(() => {
    if (location.state && location.state.id) {
      try {
        fetch(
          `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/appointment/${location.state.id}`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.status === "success") {
              setAppointment(data.data);
            } else {
              console.error(
                "Failed to load appointment details:",
                data.message
              );
            }
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching appointment details:", error);
            setLoading(false);
          });
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        setLoading(false);
      }
    } else {
      console.error("Appointment details are not available in location.state");
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return (
      <Main
        userType={
          JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
        }
      >
        <div className="flex items-center justify-center p-24">
          <div className="loader"></div>
        </div>
      </Main>
    );
  }
  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
      }
    >
      <div className="flex flex-col flex-auto p-24 rounded-2xl bg-white shadow-xl">
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
                {location.state.studentName
                  ? location.state.studentName
                  : "N/A"}
              </Text>
              <div className="flex flex-row gap-4 justify-between">
                <div>
                  <Text type="sm-heading" classNames="mb-4">
                    Date
                  </Text>
                  <Text type="paragraph" classNames="mb-8">
                    {appointment ? appointment.date : "N/A"}
                  </Text>
                </div>
                <div>
                  <Text type="sm-heading" classNames="mb-4">
                    Time
                  </Text>
                  <Text type="paragraph" classNames="mb-8">
                    {appointment
                      ? moment(appointment.time, "HH:mm:ss").format("HH:mm A")
                      : "N/A"}
                  </Text>
                </div>
              </div>
              <Text type="sm-heading" classNames="mb-4">
                Reason for Appointment
              </Text>
              <Text type="paragraph" classNames="mb-8">
                {appointment ? appointment.comment : "N/A"}
              </Text>
            </div>
            <div>
              <Button
                disabled={appointment.isFutureAppointment || appointment.hasAdviceLog }
                text="Record Meeting"
                onClick={handleRecordMeeting}
              />
              <Button
                text="Back"
                type="secondary"
                onClick={() => navigate("/advisorDashboard")}
              />
            </div>
          </div>

          <div class="w-1/2 flex-auto">
            <Text type="sm-heading" classNames="mb-4">
              Uploaded Documents
            </Text>
            <div class="flex gap-4 mb-8">
            {appointment.uploadedFiles && appointment.uploadedFiles.length > 0 ? (
                  appointment.uploadedFiles.map((document, index) => (
                    <a
                      key={index}
                      href={document.fileURL}
                      download
                      target="_blank" rel="noreferrer"
                    >
                      <div className="flex items-center justify-center p-8 flex-col rounded-2xl shadow-lg bg-gray-200 gap-4">
                        <img width={40} height={40} src={download} alt="file" />
                      <Text  >{document.fileName}</Text> 
                      </div>
                     
                    </a>
                  ))
                ) : (
                  <Text  type="paragraph">No files uploaded.</Text>
                  
                )}
            </div>
          </div>
        </div>
      </div>

      {showRecordingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-8">
            <Text type="sm-heading" classNames="mb-4">
              Recording Options
            </Text>
            <Text type="sm-subheading" classNames="mb-8">
              Select which format you would like to record in.
            </Text>
            <div className="flex gap-8 mb-4">
              <div>
                <Text type="paragraph" classNames="mb-2">
                  Video
                </Text>
                <img
                  onClick={() =>
                    navigate("/meetingRecording", { state: location.state.id })
                  }
                  class="cursor-pointer"
                  src={video}
                  alt="video"
                />
              </div>
              <div>
                <Text type="paragraph" classNames="mb-2">
                  Text
                </Text>
                <img
                  onClick={() =>
                    navigate("/meetingNotes", { state: location.state.id })
                  }
                  class="cursor-pointer"
                  src={video}
                  alt="video"
                />
              </div>
            </div>
            <Button text="Close" onClick={handleCloseModal} />
          </div>
        </div>
      )}
    </Main>
  );
};

export default AppointmentDetails;
