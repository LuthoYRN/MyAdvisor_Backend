import React from "react";
import { useEffect } from "react";
import Text from "./components/Text.jsx";
import Main from "./layout/Main.jsx";
import Button from "./components/Button.jsx";
import { ReactMediaRecorder } from "react-media-recorder";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import config from "./config.js";
import ConfirmationModal from "./components/ConfirmationModal.jsx";

/*
    Data Needed:
    - Store the recording
  */

const MeetingRecording = () => {
  let location = useLocation();
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);

  const handleSave = async (mediaBlobUrl) => {
    if (!mediaBlobUrl) return;

    const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
    const formData = new FormData();
    formData.append("video", blob, "meeting_recording.mp4");

    try {
      const response = await fetch(
        `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/appointment/${location.state}/video/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (result.status === "success") {
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
                    onClick={() => handleSave(mediaBlobUrl)}
                    text={"Save Recording"}
                  />
                )}
                <Button text={"Cancel"} type={"secondary"} />
              </div>
            </div>
          )}
        />
      </div>
      {showConfirmationModal && (
        <ConfirmationModal
          status={"Success"}
          message={"Successfully saved recording"}
          onConfirm={"/advisorDashboard"}
        />
      )}
    </Main>
  );
};

export default MeetingRecording;
