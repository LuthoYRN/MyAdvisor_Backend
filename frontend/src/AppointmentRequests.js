import React from "react";
import Container from "./layout/Container.jsx";
import robot from "./assets/robot.svg";
import Text from "./components/Text.jsx";
import Card from "./components/Card.jsx";
import ChatLine from "./components/ChatLine.jsx";
import Menu from "./components/Menu.jsx";
import Header from "./components/Header.jsx";
import Main from "./layout/Main.jsx";
import Button from "./components/Button.jsx";
import { useNavigate } from "react-router-dom";

const AppointmentRequests = () => {
  const [requests, setRequests] = React.useState([]);
  const [notificationDetails, setNotificationDetails] = React.useState([]);
  const [requestID, setRequestID] = React.useState(null);
  let navigate = useNavigate();

  const getRequestDetails = async (request) => {
    try {
      console.log("Fetching request details...");
      const response = await fetch(
        `https://sloth-relevant-basilisk.ngrok-free.app/api/advisor/${localStorage.getItem("user_id")}/requests/${request.id}`,
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
      setNotificationDetails(data.data);
      console.log("notificationDetails:", notificationDetails);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching notifications...");
        const response = await fetch(
          `https://sloth-relevant-basilisk.ngrok-free.app/api/advisor/${localStorage.getItem("user_id")}/requests`,
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
        setRequests(data.data.requests);
        console.log("requests:", requests);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleReview = () => {
    navigate("/appointmentApprove", { state: {notificationDetails: notificationDetails, requestID: requestID} });
  }

  return (
    <Main userType={"advisor"} activeMenuItem={"notifications"}>
      <div class="mb-10 max-h-36">
        <Header
          user={`${JSON.parse(localStorage.getItem("userData")).advisor.name}`}
          info={
            JSON.parse(localStorage.getItem("userData")).advisor.office
          }
        />
      </div>
      <div class="flex jus flex-auto gap-8 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        <div class="flex w-1/3 flex-col gap-4">
          <Text type="heading" classNames="mb-8">
            Notifications
          </Text>
          <div class="items-center">
            {requests && requests.map((request) => (
              <Card
                imgSrc={robot}
                heading={"Appointment Request"}
                info={request.studentName}
                side={request.createdAt}
                onClick={() => {
                  getRequestDetails(request);
                  setRequestID(request.id);
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
                  "{notificationDetails.studentName}" has requested an appointment
                </Text>
                <Text type="paragraph" classNames="mb-8">
                  {notificationDetails.comment}
                </Text>
                <Button text="Review" onClick={handleReview}/>
              </>
            )}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default AppointmentRequests;
