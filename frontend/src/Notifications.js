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

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching notifications...");
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
        console.log("response", response);
        const data = await response.json();
        setNotifications(data.data);
        console.log("Notifications:", notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Main userType={"student"} activeMenuItem={"notifications"}>
      <div className="mb-10 max-h-36">
        <Header
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
          {notifications && notifications.length > 0 ? (
            <div className="items-center max-h-[500px] px-2 overflow-y-auto">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  imgSrc={robot}
                  heading={notification.type}
                  info={
                    notification.appointment?.advisorName || "No advisor name"
                  }
                  side={notification.appointment?.time || "No time provided"}
                  classNames="mb-4 cursor-pointer"
                  onClick={() => setNotificationDetails(notification)}
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
                    {notificationDetails.type || ""}
                  </Text>
                  <Text type="paragraph" classNames="mb-8">
                    {notificationDetails.type === "Approval"
                      ? `${notificationDetails.appointment?.advisorName || "No advisor"} has approved your appointment request`
                      : `${notificationDetails.message || "Click on a notification"}`}
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
