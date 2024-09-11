import React from "react";
import Container from "./layout/Container.jsx";
import robot from "./assets/robot.svg";
import Text from "./components/Text.jsx";
import Card from "./components/Card.jsx";
import ChatLine from "./components/ChatLine.jsx";
import Menu from "./components/Menu.jsx";
import Header from "./components/Header.jsx";
import Main from "./layout/Main.jsx";

const Notifications = () => {
  const [notifications, setNotifications] = React.useState([]);
  const [notificationDetails, setNotificationDetails] = React.useState([]);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching notifications...");
        const response = await fetch(
          `https://sloth-relevant-basilisk.ngrok-free.app/api/student/${localStorage.getItem("user_id")}/notifications`,
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
      <div class="mb-10 max-h-36">
        <Header
          user={`${JSON.parse(localStorage.getItem("userData")).student.name} ${JSON.parse(localStorage.getItem("userData")).student.surname}`}
          info={
            JSON.parse(localStorage.getItem("userData")).student
              .majorOrProgramme
          }
        />
      </div>
      <div class="flex jus flex-auto gap-8 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        <div class="flex w-1/3 flex-col gap-4">
          <Text type="heading" classNames="mb-8">
            Notifications
          </Text>
          <div class="items-center">
            {notifications.map((notification) => (
              <Card
                imgSrc={robot}
                heading={notification.type}
                info={notification.appointment.advisorName}
                side={notification.appointment.time}
                onClick={() => {
                  setNotificationDetails(notification);
                }}
              />
            ))}
          </div>
        </div>
        <div class="flex w-2/3 border-l border-gray-200">
          <div class="flex flex-col flex-auto  gap-8 col-span-2 p-8 m-8  rounded-2xl bg-white shadow-xl">
            {notificationDetails && (
              <>
                <Text type="sm-heading" classNames="mb-8">
                  {notificationDetails.type}
                </Text>
                <Text type="paragraph" classNames="mb-8">
                  {notificationDetails.message}
                </Text>
              </>
            )}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Notifications;
