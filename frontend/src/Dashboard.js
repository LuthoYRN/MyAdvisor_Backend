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
  const [progress, setProgress] = useState(null);

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
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/student/${localStorage.getItem("user_id")}/smartAdvisor/progress`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        const progressData = await response.json();
        console.log("Progress Data:", progressData);
        setProgress(progressData.data);
        
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    fetchProgressData();
  }, []);

  const [chatLines, setChatLines] = useState([]);

  useEffect(() => {
    if (userData) {
      setChatLines([{ text: `Hi ${userData.student.name}, how can I help you today?`, type: "chat" }]);
    }
  }, [userData]);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  const { student, upcomingAppointments, unreadNotifications } = userData;
  const handleOptionClick = (option) => {
    if (option === "Remaining courses") {
      if (progress && progress.remainingCourses && progress.remainingCourses.length > 0) {
        const remainingCoursesText = `You have ${progress.remainingCourses.length} remaining courses: ${progress.remainingCourses.map(course => course.courseName).join(", ")}.`;
        setChatLines((prevChatLines) => [
          ...prevChatLines,
          { text: remainingCoursesText, type: "chat" },
          { text: "Is there anything else I can help you with?", type: "chat" },
        ]);
      } else if (progress && progress.remainingCourses && progress.remainingCourses.length === 0) {
        setChatLines((prevChatLines) => [
          ...prevChatLines,
          { text: "Congratulations! You have completed all your courses.", type: "chat" },
          { text: "Is there anything else I can help you with?", type: "chat" },
        ]);
      } else {
        setChatLines((prevChatLines) => [
          ...prevChatLines,
          { text: "Loading your remaining courses, please wait...", type: "chat" },
        ]);
      }
    }
    if (option === "Completed courses") {
      if (progress && progress.completedCourses && progress.completedCourses.length > 0) {
        const remainingCoursesText = `You completed ${progress.completedCourses.length} courses: ${progress.completedCourses.map(course => course.courseID).join(", ")}.`;
        setChatLines((prevChatLines) => [
          ...prevChatLines,
          { text: remainingCoursesText, type: "chat" },
          { text: "Is there anything else I can help you with?", type: "chat" },
        ]);
      } else if (progress && progress.completedCourses && progress.completedCourses.length === 0) {
        setChatLines((prevChatLines) => [
          ...prevChatLines,
          { text: "Congratulations! You have completed all your courses.", type: "chat" },
          { text: "Is there anything else I can help you with?", type: "chat" },
        ]);
      } else {
        setChatLines((prevChatLines) => [
          ...prevChatLines,
          { text: "Loading your remaining courses, please wait...", type: "chat" },
        ]);
      }
    }
    // Handle other options similarly
  };
  

 
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
            {chatLines.map((line, index) => (
              <ChatLine key={index} text={line.text} type={line.type} />
            ))}
            
            <div className="flex w-4/6 justify-end ml-auto flex-wrap">
              <ChatLine text="Completed Courses" type="option" onClick={() => handleOptionClick("Completed courses")} />
              <ChatLine text="Remaining courses" type="option" onClick={() => handleOptionClick("Remaining courses")} />
              <ChatLine text="Equivalent Courses" type="option" onClick={() => handleOptionClick("Equivalent Courses")} />
              <ChatLine text="Common Electives" type="option" onClick={() => handleOptionClick("Common Electives")} />
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Dashboard;
