import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Text from "./components/Text.jsx";
import Card from "./components/Card.jsx";
import Header from "./components/Header.jsx";
import Main from "./layout/Main.jsx";
import CustomCalendar from "./components/customCalendar.jsx";
import Calendar from "./components/Calendar.jsx";
import moment from "moment";
import config from "./config";

const AdvisorDashboard = () => {
  const [date, setDate] = React.useState(null);
  const [userData, setUserData] = React.useState(null);
  const [advisorType, setAdvisorType] = React.useState("seniorAdvisor");
  const [loading, setLoading] = React.useState(true);
  const [appointments, setAppointments] = React.useState([]);
  let location = useLocation();
  let navigate = useNavigate();

  const handleDateSelect = (date) => {
    setDate(date);
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}?date=${date}`,
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
        console.log("Appointments:", appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  };

  useEffect(() => {
    if (!location.state) {
      console.error("No state found in location");
      return;
    }

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
        setAppointments(data.data.appointments);
        console.log("User Data:", userData);
        localStorage.setItem("userData", JSON.stringify(data.data));
        setLoading(false); // Stop loading when data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Stop loading on error
      }
    };

    fetchData();
  }, []);

  return (
    <Main userType={advisorType} activeMenuItem={"home"}>
      <div class="mb-10 max-h-36">
        <Header
          profile_url={userData?.advisor?.profile_url}
          user={`${userData?.advisor?.name}`}
          info={userData?.advisor?.office}
          unreadCount={userData?.unreadAppointmentRequests}
        />
      </div>
      <div class="flex-auto grid grid-cols-2 gap-14 justify-between bg-white rounded-2xl  shadow-xl ">
        <div class="flex flex-col p-8 ">
          <Text type="heading" classNames="mb-8">
            Appointments
          </Text>{" "}
          <div className="ml-6 p-6 bg-white rounded-lg shadow-lg mb-6 h-auto min-h-[300px] md:min-h-[400px] lg:min-h-[500px]">
            <CustomCalendar onDateSelect={handleDateSelect} />
          </div>
        </div>
        <div class="border-l border-gray-200 flex flex-col h-full p-8 gap-8">
          {date && (
            <Text type="heading" classNames="mb-4">
              {moment(date).format("DD/MMM/YYYY")}
            </Text>
          )}
          {date &&
            appointments.map((appointment) => (
              <Card
                heading={appointment.studentName}
                side={appointment.time}
                onClick={() => {
                  navigate("/appointmentDetails", { state: appointment });
                }}
              />
            ))}
          {!date && (
            <Text type="paragraph">Select a date to view appointments</Text>
          )}
          {date && appointments.length === 0 && (
            <Text type="paragraph">No appointments found for this date</Text>
          )}
        </div>
      </div>
    </Main>
  );
};

export default AdvisorDashboard;
