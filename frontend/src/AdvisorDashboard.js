import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Text from "./components/Text.jsx";
import Card from "./components/Card.jsx";
import Header from "./components/Header.jsx";
import Main from "./layout/Main.jsx";
import CustomCalendar from "./components/customCalendar.jsx";
import moment from "moment";
import config from "./config";

const AdvisorDashboard = () => {
  const [date, setDate] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAppointments, setloadingAppointments] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch appointments for a selected date
  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD"); // Formatting the date as required by the API
    const fetchAppointments = async () => {
      setloadingAppointments(true);
      try {
        const response = await fetch(
          `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}?date=${formattedDate}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        const data = await response.json();
        setAppointments(data.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setloadingAppointments(false);
      }
    };
    fetchAppointments();
  };

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
        setLoading(false);
        setUserData(data.data);
        localStorage.setItem("userData", JSON.stringify(data.data));
        setAppointments(data.data.appointments);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Main
        userType={
          JSON.parse(localStorage.getItem("userData"))
            ? JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
            : userData?.advisor?.advisor_level
        }
        activeMenuItem="home"
      >
        <div className="flex justify-center items-center h-screen">
          <div className="loader"></div>
        </div>
      </Main>
    );
  }

  return (
    <Main userType={userData?.advisor?.advisor_level} activeMenuItem="home">
      <div className="mb-10 max-h-36">
        <Header
          profile_url={userData?.advisor?.profile_url}
          user={`${userData?.advisor?.name}`}
          info={userData?.advisor?.office}
          unreadCount={userData?.unreadAppointmentRequests}
          user_type="advisor"
        />
      </div>
      <div className="flex-auto grid grid-cols-2 gap-14 justify-between bg-white rounded-2xl shadow-xl">
        <div className="flex flex-col p-8">
          <Text type="heading" classNames="mb-8">
            Appointments
          </Text>
          <div className="items-start h-auto min-h-[300px] md:min-h-[400px] lg:min-h-[500px]">
            <CustomCalendar onDateSelect={handleDateSelect} />
          </div>
        </div>
        <div className="border-l mt-8 -mb-32 border-gray-200 flex flex-col h-[90%] px-8 gap-8">
          {date && (
            <Text type="heading" classNames="mb-4">
              {moment(date).format("DD MMM YYYY")}
            </Text>
          )}
          {loadingAppointments ? (
            <div className="flex justify-center">
              <div className="loader"></div>{" "}
            </div>
          ) : date && appointments.length > 0 ? (
            appointments.map((appointment) => (
              <Card
                key={appointment.id}
                heading={appointment.studentName}
                side={appointment.time}
                info="Click to view details"
                appointmentCard={true}
                onClick={() =>
                  navigate("/appointmentDetails", { state: appointment })
                }
              />
            ))
          ) : (
            <Text type="paragraph">No appointments found for this date</Text>
          )}
        </div>
      </div>
    </Main>
  );
};

export default AdvisorDashboard;
