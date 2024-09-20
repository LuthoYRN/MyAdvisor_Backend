import React from "react";
import account from "../assets/account_circle.svg";
import notification from "../assets/notification.svg";
import Text from "./Text";
import { useNavigate } from "react-router-dom";
import config from "../config";
import ConfirmationModal from "./ConfirmationModal";

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
  const [successModal, setSuccessModal] = React.useState(false);

  const changeProfile = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Optional: Limit file types to images

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("profilePicture", file); // Use 'profilePicture' as the key

        try {
          const response = await fetch(
            `${config.backendUrl}/api/${localStorage.getItem("userData")?.advisor ? "advisor" : JSON.parse(localStorage.getItem("userData")).facultyID ? "facultyAdmin" : "student"}/${localStorage.getItem("user_id")}/uploadProfilePicture`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            const data = await response.json();
            setSuccessModal(true);
          } else {
            console.error("File upload failed:", response.statusText);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    };

    fileInput.click();
  };

  return (
    <div class="flex items-center h-full bg-white rounded-2xl shadow-xl mb-10">
      <img
        src={profile_url}
        alt="account"
        class="ml-4 rounded-full cursor-pointer"
        width={80}
        height={80}
        onClick={changeProfile}
      />
      <div class="flex flex-col justify-center  p-4 ml-4 my-4 w-full h-5/6">
        <Text type="heading">{user}</Text>
        <Text type="m-subheading" classNames="mt-2 ">
          {info}
        </Text>
        <Text type="sm-subheading">{subinfo}</Text>
      </div>
      <div
        className="relative mr-12 cursor-pointer"
        onClick={() => {
          user_type
            ? navigate("/appointmentRequests")
            : navigate("/notifications");
        }}
      >
        {localStorage.getItem("userData") && !JSON.parse(localStorage.getItem("userData")).facultyID && (
          <>
            <img src={notification} alt="notification" className="w-10 h-10" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </div>
      {successModal && (
        <ConfirmationModal
          setModal={setSuccessModal}
          message="Profile picture updated successfully"
          close={() => {
            setSuccessModal(false);
            window.location.reload(); // Refresh the page
          }}
        />
      )}
    </div>
  );
};

export default Header;
