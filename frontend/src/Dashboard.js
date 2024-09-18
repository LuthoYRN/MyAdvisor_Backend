import React, { useEffect, useState } from "react";
import Container from "./layout/Container";
import robot from "./assets/robot.svg";
import Text from "./components/Text";
import Card from "./components/Card";
import ChatLine from "./components/ChatLine.jsx";
import Header from "./components/Header.jsx";
import Main from "./layout/Main";
import { useLocation } from "react-router-dom";
import config from "./config";
import moment from "moment";

const Dashboard = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null); // Changed to null to handle loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/student/${localStorage.getItem("user_id")}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        const data = await response.json();
        setUserData(data.data);
        localStorage.setItem("userData", JSON.stringify(data.data));
      } catch (error) {
        alert("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  const { student, upcomingAppointments, unreadNotifications } = userData;

  return (
    <Main userType={"student"} activeMenuItem={"home"}>
      <div className="mb-10 max-h-36">
        <Header
          profile_url={student.profile_url}
          user={`${student.name} ${student.surname}`}
          info={student.majorOrProgramme}
          unreadCount={unreadNotifications}
        />
      </div>

      <div className="flex-auto grid grid-cols-2 gap-14 justify-between">
        {/* Upcoming Appointments */}
        <div className="flex flex-col p-8 rounded-2xl bg-white shadow-xl">
          <Text type="heading" classNames="mb-8 ml-2">
            Upcoming Appointments
          </Text>
          <div className="items-center lg:max-h-[200px] xl:max-h-[550px] px-2 overflow-y-auto gap-4 flex flex-col">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment, index) => (
                <Card
                  key={index}
                  heading={`Meeting with ${appointment.advisorName}`}
                  info={appointment.office}
                  //slice appointment to only show hh:mm using moment
                  side={moment(
                    appointment.date + " " + appointment.time
                  ).format("DD-MM-yyyy HH:mm")}
                />
              ))
            ) : (
              <Text>No upcoming appointments</Text>
            )}
          </div>
        </div>

        {/* SMART Advisor */}
        <div className="flex flex-col rounded-2xl bg-white shadow-xl h-full">
          <div className="flex p-4 items-center">
            <img src={robot} alt="SMART Advisor" className="h-1/2" />
            <Text classNames="my-auto" type="heading">
              SMART Advisor
            </Text>
          </div>

          <div className="border-b border-gray-500"></div>

          <div className="flex flex-col p-8">
            <ChatLine
              text={`Hi ${student.name}, how can I help you today?`}
              type="chat"
            />
            <ChatLine
              text={`Hi ${student.name}, how can I help you today?`}
              type="user"
            />
            <ChatLine
              text={`Hi ${student.name}, how can I help you today?`}
              type="chat"
            />
            <div className="flex w-4/6 justify-end ml-auto flex-wrap">
              <ChatLine text="Credit Calculation" type="option" />
              <ChatLine text="Remaining courses" type="option" />
              <ChatLine text="Equivalent Courses" type="option" />
              <ChatLine text="Common Electives" type="option" />
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Dashboard;
