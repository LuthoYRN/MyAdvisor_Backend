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
import send from "./assets/send.svg";

const Dashboard = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [progress, setProgress] = useState(null);
  const [chatLines, setChatLines] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // Manage typing state
  const [showTextInput, setShowTextInput] = useState(false); // Toggle input visibility
  const [showOptions, setShowOptions] = useState(true); // Toggle input visibility
  const [inputPrompt, setInputPrompt] = useState(""); // Store the current prompt
  const [courseCode, setCourseCode] = useState(""); // For storing user input
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
          `${config.backendUrl}/api/smartAdvisor/progress/${localStorage.getItem("user_id")}`,
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
      }, 30); // Adjust the delay to control typing speed
    } else {
      callback();
    }
  };

  // Separate function for fetching credit summary
  const fetchCreditSummary = async () => {
    setIsTyping(true); // Start typing effect
    let responseText = "";

    try {
      const response = await fetch(
        `${config.backendUrl}/api/smartAdvisor/credits/${localStorage.getItem("user_id")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      const data = await response.json();
      responseText = data.message; // Extract message from the API response
    } catch (error) {
      console.error("Error fetching credit summary:", error);
      responseText = "Error retrieving credit summary. Please try again.";
    }

    // Trigger typing effect for the system response
    typeEffect(responseText, 0, () => {
      setChatLines((prevChatLines) => [
        ...prevChatLines,
        { text: "Is there anything else I can help you with?", type: "chat" }, // Follow-up message
      ]);
      setIsTyping(false); // Set typing state back to false when typing is complete
    });
  };

  const handleOptionClick = (option) => {
    if (isTyping) return; // Prevent click during typing

    setIsTyping(true); // Set typing state to true when typing starts

    setChatLines((prevChatLines) => [
      ...prevChatLines,
      { text: option, type: "user" }, // Display the clicked option on the right
      { text: "", type: "chat" }, // Placeholder for the typing effect
    ]);

    if (option === "Equivalents" || option === "Prerequisites") {
      // Show input for specific options
      setShowTextInput(true);
      setInputPrompt(option); // Set input prompt type
      setIsTyping(false); // Set typing state back to false
    } else if (option === "Credit summary") {
      // Call the separate function for credit summary
      fetchCreditSummary();
    } else {
      // Handle regular options like "Remaining courses"
      let responseText = "";

      if (option === "Remaining courses") {
        if (progress && progress.remainingCourses?.length > 0) {
          responseText = `You have ${progress.remainingCourses.length} remaining course(s): ${progress.remainingCourses
            .map((course) => course.courseID)
            .join(", ")}.`;
        } else if (progress && progress.remainingCourses?.length === 0) {
          responseText =
            "Congratulations! You have completed all your courses.";
        } else {
          responseText = "Loading your remaining courses, please wait...";
        }
      }

      if (option === "Completed courses") {
        if (progress && progress.completedCourses?.length > 0) {
          responseText = `You have completed ${progress.completedCourses.length} course(s): ${progress.completedCourses
            .map((course) => course.courseID)
            .join(", ")}.`;
        } else if (progress && progress.completedCourses?.length === 0) {
          responseText = "You have not completed any course.";
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
        setIsTyping(false); // Set typing state back to false when typing is complete
      });
    }
  };

  const handleTextInputSubmit = async () => {
    setShowTextInput(false);
    setShowOptions(false);
    if (courseCode.trim() === "") {
      setShowOptions(true);
      setCourseCode("");
      return;
    } // Prevent empty input

    // Set the typing state to true
    setIsTyping(true);

    // Display the user's input (course code)
    setChatLines((prevChatLines) => [
      ...prevChatLines,
      {
        text: `What are the ${inputPrompt} for ${courseCode}?`,
        type: "user",
      },
      { text: "", type: "chat" }, // Placeholder for typing effect
    ]);

    // Make the API call depending on the input prompt (Equivalents or Prerequisites)
    let responseText = "";
    try {
      const response = await fetch(
        `${config.backendUrl}/api/smartAdvisor/${inputPrompt.toLowerCase()}/${courseCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      const data = await response.json();
      responseText = data.message; // Extract message from response
    } catch (error) {
      responseText = "Error retrieving data. Please try again.";
      console.error(error);
    }

    // Trigger typing effect for the API response
    typeEffect(responseText, 0, () => {
      setChatLines((prevChatLines) => [
        ...prevChatLines,
        { text: "Is there anything else I can help you with?", type: "chat" }, // Follow-up message
      ]);
      setIsTyping(false); // Reset typing state
    });

    // Reset input field
    setShowOptions(true);
    setCourseCode("");
  };

  if (!userData) {
    return (
      <Main userType={"student"} activeMenuItem={"home"}>
        <div className="flex justify-center items-center h-screen">
          <div className="loader"></div>
        </div>
      </Main>
    );
  }

  const {
    student,
    pastAppointments,
    upcomingAppointments,
    unreadNotifications,
  } = userData;

  return (
    <Main userType={"student"} activeMenuItem={"home"}>
      <div className="mb-10 max-h-36">
        <Header
          profile_url={student.profile_url}
          user={`${student.name} ${student.surname}`}
          info={student.majorOrProgramme}
          unreadCount={unreadNotifications}
          user_type={"student"}
        />
      </div>

      <div className="flex-auto grid grid-cols-2 gap-14 justify-between">
        <div className="flex flex-col p-8 rounded-2xl bg-white shadow-xl">
          {/* Past Appointments */}
          <div className="gap-14 mb-4">
            <Text type="heading" classNames="mb-8 ml-2">
              Past Appointments
            </Text>
            <div className="items-center lg:max-h-[200px] xl:max-h-[550px] px-2 overflow-y-auto gap-4 flex flex-col">
              {pastAppointments.length > 0 ? (
                pastAppointments.map((appointment, index) => (
                  <Card
                    key={index}
                    heading={`Met with ${appointment.advisorName}`}
                    info={appointment.office}
                    side={moment(
                      appointment.date + " " + appointment.time
                    ).format("DD-MM-yyyy HH:mm")}
                  />
                ))
              ) : (
                <Text>No past appointments</Text>
              )}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div>
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

            {/* Show text input for equivalents/prerequisites */}
            {showTextInput && (
              <div className="flex flex-row w-full mt-4">
                <input
                  type="text"
                  placeholder={`Enter course code for ${inputPrompt}`}
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTextInputSubmit();
                    }
                  }}
                  className="border border-like-shadow p-2 rounded-lg w-full outline-none"
                />
                <button
                  onClick={handleTextInputSubmit}
                  className="ml-4 p-2 bg-primary rounded-full cursor-pointer flex justify-center items-center transition-transform transform hover:scale-105 hover:bg-secondary hover:text-white ease-in-out duration-300"
                >
                  <img
                    src={send} // Path to your send icon
                    alt="Send Icon"
                    className="h-8 w-8"
                  />
                </button>
              </div>
            )}

            {!showTextInput && showOptions && (
              <div className="flex flex-row w-4/6 justify-end ml-auto flex-wrap">
                {[
                  "Completed courses",
                  "Remaining courses",
                  "Equivalents",
                  "Prerequisites",
                  "Credit summary",
                ].map((option) => (
                  <ChatLine
                    key={option}
                    text={option}
                    onClick={() => handleOptionClick(option)}
                    className={`p-2 border rounded-lg ${
                      isTyping
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-100 text-black cursor-pointer"
                    }`}
                    disabled={isTyping}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Dashboard;
