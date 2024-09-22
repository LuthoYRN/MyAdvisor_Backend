import React from "react";
import robot from "./assets/robot.svg";
import Text from "./components/Text.jsx";
import Card from "./components/Card.jsx";
import Header from "./components/Header.jsx";
import Main from "./layout/Main.jsx";
import Button from "./components/Button.jsx";
import { useNavigate } from "react-router-dom";
import config from "./config";

const AppointmentRequests = () => {
  const [requests, setRequests] = React.useState([]);
  const [notificationDetails, setNotificationDetails] = React.useState(null);
  const [requestID, setRequestID] = React.useState(null);
  const [activeId, setActiveId] = React.useState(null);
  const [loading, setLoading] = React.useState(true); // State to track loading status
  let navigate = useNavigate();

  const getRequestDetails = async (request) => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/requests/${request.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setNotificationDetails(data.data);
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  const markRequestAsRead = async (requestID) => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/requests/${requestID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
          body: JSON.stringify({ status: "read" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to mark request as read");
      }
    } catch (error) {
      console.error("Error marking request as read:", error);
    }
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === requestID ? { ...req, isRead: true } : req
      )
    );
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/requests`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to mark all requests as read");
      }
      setRequests((prevRequests) =>
        prevRequests.map((req) => ({ ...req, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking all requests as read:", error);
    }
  };

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/requests`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setRequests(data.data.requests);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false after fetching
      }
    };

    fetchNotifications();
  }, []);

  const handleReview = () => {
    navigate("/appointmentApprove", {
      state: { notificationDetails: notificationDetails, requestID: requestID },
    });
  };

  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
      }
      activeMenuItem={"appointmentRequests"}
    >
      <div className="mb-10 max-h-36">
        <Header
          profile_url={`${JSON.parse(localStorage.getItem("userData")).advisor.profile_url}`}
          user={`${JSON.parse(localStorage.getItem("userData")).advisor.name}`}
          info={JSON.parse(localStorage.getItem("userData")).advisor.office}
          user_type={"Advisor"}
        />
      </div>
      <div className="flex jus flex-auto gap-8 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        <div className="flex justify-between w-1/3 flex-col gap-4">
          <div className="flex flex-col gap-4">
            <Text type="heading" classNames="mb-4">
              Appointment Requests
            </Text>
            <div className="items-center max-h-96 py-4 px-2 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center">
                  <div className="loader"></div>{" "}
                </div>
              ) : requests.length > 0 ? (
                requests.map((request) => (
                  <Card
                    key={request.id}
                    imgSrc={robot}
                    heading={"Appointment Request"}
                    info={request.studentName}
                    side={request.createdAt}
                    read={request.isRead}
                    active={activeId == request.id}
                    status={"Approval"}
                    onClick={() => {
                      getRequestDetails(request);
                      setRequestID(request.id);
                      markRequestAsRead(request.id);
                      setActiveId(request.id);
                    }}
                    classNames={"mb-4"}
                  />
                ))
              ) : (
                <Text type="paragraph">No requests available.</Text>
              )}
            </div>
          </div>
          <Button
            text="Mark All as Read"
            onClick={markAllAsRead}
            classNames="mt-4"
          />
        </div>
        <div className="flex w-2/3 border-l border-gray-200">
          <div className="flex flex-col flex-auto gap-8 col-span-2 p-8 m-8 rounded-2xl bg-white shadow-xl">
            {notificationDetails && (
              <>
                <Text type="sm-heading" classNames="mb-8">
                  Appointment request
                </Text>
                <div className="p-6 bg-white border-2 border-primary rounded-lg shadow-lg mb-6 h-auto">
                  <Text type="paragraph" classNames="mb-8">
                    You have received a new appointment request from{" "}
                    {notificationDetails.studentName}. Please review the details
                    and confirm or reject the appointment. Thank you!
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Button
                    text="Review"
                    style={{ width: "50%" }}
                    onClick={handleReview}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default AppointmentRequests;
