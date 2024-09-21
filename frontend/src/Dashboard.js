import React, { useEffect, useState, useRef } from "react";
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
  const [userData, setUserData] = useState(null);
  const [progress, setProgress] = useState(null);
  const [chatLines, setChatLines] = useState([]);
  const chatContainerRef = useRef(null); // Ref to control the chat scroll behavior

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
        setProgress(progressData.data);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    fetchProgressData();
  }, []);

  useEffect(() => {
    if (userData) {
      setChatLines([
        {
          text: `Hi ${userData.student.name}, how can I help you today?`,
          type: "chat",
        },
      ]);
    }
  }, [userData]);

  // Scroll to the bottom of the chat when a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatLines]); // Dependency to trigger scrolling when chatLines updates

  const typeEffect = (text, index = 0, callback) => {
    if (index < text.length) {
      setTimeout(() => {
        setChatLines((prevChatLines) => [
          ...prevChatLines.slice(0, -1), // Remove the last line (typing effect)
          {
            text: prevChatLines[prevChatLines.length - 1].text + text[index],
            type: "chat",
          },
        ]);
        typeEffect(text, index + 1, callback);
      }, 40); // Adjust the delay to control typing speed
    } else {
      callback();
    }
  };

  const handleOptionClick = (option) => {
    setChatLines((prevChatLines) => [
      ...prevChatLines,
      { text: option, type: "user" }, // Display the clicked option on the right
      { text: "", type: "chat" }, // Placeholder for the typing effect
    ]);

    let responseText = "";

    if (option === "Remaining courses") {
      if (progress && progress.remainingCourses?.length > 0) {
        responseText = `You have ${progress.remainingCourses.length} remaining courses: ${progress.remainingCourses
          .map((course) => course.courseName)
          .join(", ")}.`;
      } else if (progress && progress.remainingCourses?.length === 0) {
        responseText = "Congratulations! You have completed all your courses.";
      } else {
        responseText = "Loading your remaining courses, please wait...";
      }
    }

    if (option === "Completed courses") {
      if (progress && progress.completedCourses?.length > 0) {
        responseText = `You completed ${progress.completedCourses.length} courses: ${progress.completedCourses
          .map((course) => course.courseID)
          .join(", ")}.`;
      } else if (progress && progress.completedCourses?.length === 0) {
        responseText = "Congratulations! You have completed all your courses.";
      } else {
        responseText = "Loading your completed courses, please wait...";
      }
    }

    // Trigger typing effect for the system response
    typeEffect(responseText, 0, () => {
      setChatLines((prevChatLines) => [
        ...prevChatLines,
        { text: "Is there anything else I can help you with?", type: "chat" }, // Follow-up message
      ]);
    });
  };

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

        <div className="flex flex-col rounded-2xl bg-white shadow-xl h-full">
          <div className="flex flex-row p-4 items-center">
            <img src={robot} alt="SMART Advisor" className="h-full mr-4" />
            <div className="flex flex-col">
              <Text classNames="my-auto" type="heading">
                SMART Advisor
              </Text>
              <Text classNames="mt-2 text-sm text-gray-500">
                <span className="text-red-500">Disclaimer: </span>
                Please note that advice from SMART Advisor might be inaccurate.
              </Text>
            </div>
          </div>

          <div className="border-b border-gray-500"></div>

          {/* Chat container */}
          <div
            ref={chatContainerRef}
            className="flex flex-col lg:max-h-[200px] xl:max-h-[500px] overflow-y-auto p-8"
          >
            {/* Display chat lines */}
            {chatLines.map((line, index) => (
              <ChatLine key={index} text={line.text} type={line.type} />
            ))}

            {/* Options */}
            <div className="flex w-4/6 justify-end ml-auto flex-wrap">
              {[
                "Completed courses",
                "Remaining courses",
                "Equivalent Courses",
                "Common Electives",
              ].map((option) => (
                <ChatLine
                  key={option}
                  text={option}
                  onClick={() => handleOptionClick(option)}
                  className={`p-2 border rounded-lg ${
                    chatLines.some((line) => line.text === option)
                      ? "bg-secondary-500 text-white"
                      : "bg-gray-100 text-black"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Dashboard;
