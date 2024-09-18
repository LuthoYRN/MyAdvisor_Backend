import React from "react";
import Container from "./layout/Container.jsx";
import robot from "./assets/robot.svg";
import Text from "./components/Text.jsx";
import Card from "./components/Card.jsx";
import Header from "./components/Header.jsx";
import Main from "./layout/Main.jsx";
import config from "./config";

const Notifications = () => {
  const [notifications, setNotifications] = React.useState([]);
  const [notificationDetails, setNotificationDetails] = React.useState([]);
  const [activeNotificationId, setActiveNotificationId] = React.useState(null);
  const [loading, setLoading] = React.useState(true); // State to track loading status

  const markNotificationAsRead = async (notificationID) => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/student/${localStorage.getItem("user_id")}/notifications/${notificationID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "read" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
    setNotifications((prevNotifications) =>
      prevNotifications.map((noti) =>
        noti.id === notificationID ? { ...noti, isRead: true } : noti
      )
    );
  };

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/student/${localStorage.getItem("user_id")}/notifications`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        const data = await response.json();
        setNotifications(data.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching
      }
    };

    fetchNotifications();
  }, []);
  return (
    <Main userType={"student"} activeMenuItem={"notifications"}>
      <div className="mb-10 max-h-36">
        <Header
          profile_url={`${JSON.parse(localStorage.getItem("userData")).student.profile_url}`}
          user={`${JSON.parse(localStorage.getItem("userData"))?.student?.name || ""} ${JSON.parse(localStorage.getItem("userData"))?.student?.surname || ""}`}
          info={
            JSON.parse(localStorage.getItem("userData"))?.student
              ?.majorOrProgramme || ""
          }
        />
      </div>

      <div className="flex flex-auto gap-8 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        {/* Left Section: Notifications */}
        <div className="flex w-1/3 flex-col gap-4">
          <Text type="heading" classNames="mb-8">
            Notifications
          </Text>

          {/* Only render notifications if they exist */}
          {loading ? (
            <div className="flex justify-center">
              <div className="loader"></div>{" "}
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="items-center max-h-[500px] px-2 overflow-y-auto">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  imgSrc={robot}
                  heading={notification.type}
                  info={notification.appointment?.advisorName}
                  side={notification.appointment?.time}
                  active={activeNotificationId === notification.id}
                  read={notification.isRead}
                  status={notification.type}
                  classNames="mb-4 cursor-pointer"
                  onClick={() => {
                    setNotificationDetails(notification);
                    setActiveNotificationId(notification.id);
                    markNotificationAsRead(notification.id);
                  }}
                />
              ))}
            </div>
          ) : (
            <Text type="paragraph" classNames="text-gray-500">
              No notifications available
            </Text>
          )}
        </div>

        {/* Right Section: Notification Details - Only show if there are notifications */}
        {notifications && notifications.length > 0 && (
          <div className="flex w-2/3 border-l border-gray-200">
            <div className="flex flex-col flex-auto gap-8 col-span-2 p-8 m-8 rounded-2xl bg-white shadow-xl">
              {notificationDetails ? (
                <>
                  <Text type="sm-heading" classNames="mb-8">
                    {"Appointment " + notificationDetails.type || ""}
                  </Text>
                  <Text type="paragraph" classNames="mb-8">
                    {notificationDetails.type === "Approval" ? (
                      <>
                        <div className="p-6 bg-white border-2 border-primary rounded-lg shadow-lg mb-6 h-auto">
                          <Text type="paragraph" classNames="mb-2">
                            Hi{" "}
                            {
                              JSON.parse(localStorage.getItem("userData"))
                                ?.student?.name
                            }
                            ,
                          </Text>
                          <Text type="paragraph" classNames="mb-2">
                            Your appointment with{" "}
                            {notificationDetails.appointment?.advisorName} has
                            been approved and added to your appointments.
                          </Text>
                          <Text
                            type="paragraph"
                            classNames="mb-2 font-bold underline"
                          >
                            Details
                          </Text>
                          <Text type="paragraph" classNames="mb-2">
                            Advisor:{" "}
                            {notificationDetails.appointment?.advisorName ||
                              "Advisor not specified"}
                          </Text>
                          <Text type="paragraph" classNames="mb-2">
                            Office:{" "}
                            {notificationDetails.appointment?.office ||
                              "Office not specified"}
                          </Text>
                          <Text type="paragraph" classNames="mb-2">
                            Date:{" "}
                            {notificationDetails.appointment?.date ||
                              "Date not specified"}
                          </Text>
                          <Text type="paragraph" classNames="mb-2">
                            Time:{" "}
                            {notificationDetails.appointment?.time ||
                              "Time not specified"}
                          </Text>
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          padding: "1.5rem",
                          border: "2px solid rgba(245, 101, 101, 0.4)", // Same color and opacity for the border
                          borderRadius: "0.5rem",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          marginBottom: "1.5rem",
                          height: "auto",
                        }}
                      >
                        {" "}
                        <Text type="paragraph" classNames="mb-2">
                          {notificationDetails.message ||
                            "Click on a notification"}
                        </Text>
                      </div>
                    )}
                  </Text>
                </>
              ) : (
                <Text type="paragraph" classNames="text-gray-500">
                  Select a notification to see the details
                </Text>
              )}
            </div>
          </div>
        )}
      </div>
    </Main>
  );
};

export default Notifications;
