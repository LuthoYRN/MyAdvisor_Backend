import React from "react";
import notification from "../assets/notification.svg";
import Text from "./Text";
import { useNavigate } from "react-router-dom";
import config from "../config";
import SuccessModal from "./successModal.jsx";
import ErrorModal from "./errorModal.jsx";

const Header = ({
  user,
  user_type,
  profile_url,
  info,
  subinfo,
  imgSrc,
  unreadCount,
}) => {
  let navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false); // Loading state

  const changeProfile = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Optional: Limit file types to images

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        setLoading(true); // Start the loader
        const formData = new FormData();
        formData.append("profilePicture", file); // Use 'profilePicture' as the key

        try {
          const response = await fetch(
            `${config.backendUrl}/api/${user_type}/${localStorage.getItem("user_id")}/uploadProfilePicture`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            const data = await response.json();
            setShowSuccessModal(true);
          } else {
            setShowErrorModal(true);
          }
        } catch (error) {
          setShowErrorModal(true); // Show error modal in case of fetch failure
        } finally {
          setLoading(false); // Stop the loader
        }
      } else {
        // User canceled file selection
        setLoading(false); // Stop the loader
      }
    };

    fileInput.click();
  };

  return (
    <div className="flex items-center h-full bg-white rounded-2xl shadow-xl mb-10">
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 rounded-full">
            <div className="loader"></div> {/* Show the loader */}
          </div>
        )}
        <img
          src={profile_url}
          alt="account"
          className={`ml-4 rounded-full cursor-pointer ${loading ? "invisible" : "visible"}`} // Hide image while loading
          width={80}
          height={80}
          onClick={changeProfile}
        />
      </div>

      <div className="flex flex-col justify-center  p-4 ml-4 my-4 w-full h-5/6">
        <Text type="heading">{user}</Text>
        <Text type="m-subheading" classNames="mt-2 ">
          {info}
        </Text>
        <Text type="sm-subheading">{subinfo}</Text>
      </div>
      <div
        className="relative mr-12 cursor-pointer"
        onClick={() => {
          user_type === "advisor"
            ? navigate("/appointmentRequests")
            : navigate("/notifications");
        }}
      >
        {localStorage.getItem("userData") &&
          !JSON.parse(localStorage.getItem("userData")).facultyID && (
            <>
              <img
                src={notification}
                alt="notification"
                className="w-10 h-10"
              />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </>
          )}
      </div>
      <ErrorModal
        isOpen={showErrorModal}
        title={"Error"}
        message="Error uploading profile picture"
        onContinue={() => {
          setShowErrorModal(false);
        }}
      />
      <SuccessModal
        isOpen={showSuccessModal}
        title={"Success"}
        message="Profile picture updated successfully"
        onClose={() => {
          setShowSuccessModal(false);
          window.location.reload(); // Refresh the page
        }}
      />
    </div>
  );
};

export default Header;
