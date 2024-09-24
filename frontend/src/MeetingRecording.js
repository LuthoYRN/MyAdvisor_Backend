import React, { useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { ReactMediaRecorder } from "react-media-recorder";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./components/Button.jsx";
import Text from "./components/Text.jsx";
import config from "./config.js";
import Main from "./layout/Main.jsx";

/*
    Data Needed:
    - Store the recording
  */

const MeetingRecording = () => {
  let location = useLocation();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [saveRecording, setSaveRecording] = React.useState(false);

  let navigate = useNavigate();

  const handleSave = async (mediaBlobUrl) => {
    if (!mediaBlobUrl) return;
    const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
    const formData = new FormData();
    formData.append("video", blob, "meeting_recording.mp4");

    try {
      setSaveRecording(true);
      const response = await fetch(
        `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/appointment/${location.state}/video/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        setSaveRecording(false);
        setShowConfirmationModal(true);
      } else {
        console.error("Failed to save the recording:", result.message);
      }
    } catch (error) {
      console.error("Error saving the recording:", error);
    }
  };

  const VideoPreview = ({ stream }) => {
    const videoRef = useRef(null);

    useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);

    if (!stream) {
      return null;
    }

    return (
      <video
        ref={videoRef}
        width={600}
        autoPlay
        className="rounded-lg shadow-lg"
      />
    );
  };

  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
      }
    >
      <div class="flex flex-col flex-auto gap-8 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        <Text type="heading" classNames="mb-4">
          Meeting Recording
        </Text>
        <ReactMediaRecorder
          video
          render={({
            status,
            startRecording,
            stopRecording,
            mediaBlobUrl,
            previewStream,
          }) => (
            <div class="w-full flex-auto flex flex-col justify-between">
              <div class="flex flex-col gap-8">
                {status === "recording" ? (
                  <VideoPreview stream={previewStream} />
                ) : (
                  <video
                    className="rounded-lg shadow-lg"
                    width={600}
                    src={mediaBlobUrl}
                    controls
                    loop
                  />
                )}
              </div>
              <div class="flex flex-row gap-8 max-w-md">
                {status === "idle" ? (
                  <Button onClick={startRecording} text={"Start Recording"} />
                ) : status === "recording" ? (
                  <Button onClick={stopRecording} text={"Stop Recording"} />
                ) : (
                  <Button
                    disabled={saveRecording}
                    onClick={() => handleSave(mediaBlobUrl)}
                    text={"Save Recording"}
                  />
                )}
                <Button
                  text={"Cancel"}
                  type={"secondary"}
                  onClick={() => navigate(-1)}
                />
              </div>
            </div>
          )}
        />
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
              Successfully saved recording
            </Text>
            <Button
              text="Close"
              onClick={() => navigate("/advisorDashboard")}
            />
          </div>
        </div>
      )}
    </Main>
  );
};

export default MeetingRecording;
