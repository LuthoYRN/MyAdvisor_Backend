import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Text from "./components/Text.jsx";
import Card from "./components/Card.jsx";
import Header from "./components/Header.jsx";
import Main from "./layout/Main.jsx";
import moment from "moment";
import config from "./config.js";
import Button from "./components/Button.jsx";

const FacultyAdminDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [facultyRules, setFacultyRules] = useState([
    "Total Credits required",
    "Minimum GPA required",
    "NQF level requirement",
    "Degree Duration",
    "Degree Offered",
    "Faculty",
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}`,
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
        setLoading(false);
      } catch (error) {
        alert("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Main userType="Loading..." activeMenuItem="home">
        <div className="flex justify-center items-center h-screen">
          <div className="loader"></div>
        </div>
      </Main>
    );
  }

  return (
    <Main userType={"FacultyAdmin"} activeMenuItem="facultyRules">
      <div className="mb-10 max-h-36">
        <Header
          profile_url={userData?.advisor?.profile_url}
          user={`${userData?.advisor?.name}`}
          info={userData?.advisor?.office}
          unreadCount={userData?.unreadAppointmentRequests}
          user_type="advisor"
        />
      </div>
      <div className="flex-auto flex flex-col gap-14 p-8 justify-between bg-white rounded-2xl shadow-xl">
        <div className="flex flex-col">
          <Text type="heading" classNames="mb-8">
            Faculty Rules
          </Text>
          <div class="flex flex-row mb-8">
            <div class="w-1/2">
              <Text type="sm-heading" classNames="mb-4">
                Faculty
              </Text>
              <Text type="paragraph" classNames="mb-8">
                Science
              </Text>
            </div>
            <div class="ml-4">
              <Text type="sm-heading" classNames="mb-4">
                Degree Offered
              </Text>
              <Text type="paragraph" classNames="mb-8">
                BSc
              </Text>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {facultyRules.map((rule, index) => (
              <div
                class="flex bg-gray-200 rounded-2xl px-4 py-2 items-center flex-row justify-between"
                key={index}
              >
                <Text type="paragraph">{rule}</Text>
                <div class="w-14">
                  <Button text="Edit" />
                </div>
              </div>
            ))}
          </div>
          <div class="8 max-w-md">
          <Button text="Add Rule" />
        </div>
        </div>
      </div>
    </Main>
  );
};

export default FacultyAdminDashboard;
