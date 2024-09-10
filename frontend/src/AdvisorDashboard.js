import React from "react";
import robot from "./assets/robot.svg";
import Text from "./components/Text.jsx";
import Card from "./components/Card.jsx";
import ChatLine from "./components/ChatLine.jsx";
import Header from "./components/Header.jsx";
import Main from "./layout/Main.jsx";
import Calendar from "./components/Calendar.jsx";

const AdvisorDashboard = () => {
  const [date, setDate] = React.useState(null);
  const [advisorType, setAdvisorType] = React.useState("seniorAdvisor");
  const handleDateSelect = (date) => {
    setDate(date.startStr);
    console.log(date);
  };

  const appointments = [
    {
      date: "2024-09-11",
      title: "Meeting with Dr. Smith",
      info: "View Details",
      time: "12:00 PM",
    },
    {
      date: "2024-09-12",
      title: "Meeting with Dr. Smith",
      info: "View Details",
      time: "12:00 PM",
    },
    {
      date: "2024-09-12",
      title: "Meeting with Dr. Smith",
      info: "View Details",
      time: "12:00 PM",
    },
  ];

  const filteredAppointments = appointments.filter(
    (appointment) => appointment.date === date
  );

  return (
    <Main userType={advisorType} activeMenuItem={"home"}>
      <div class="mb-10 max-h-36">
        <Header
          user="Aslam Safla"
          info="Department of Computer Science"
          subinfo="2nd Year"
        />
      </div>
      <div class="flex-auto grid grid-cols-2 gap-14 justify-between bg-white rounded-2xl  shadow-xl ">
        <div class="flex flex-col p-8 ">
          <Text type="heading" classNames="mb-8">
            Appointments
          </Text>
          <Calendar onDateSelect={handleDateSelect} />
        </div>
        <div class="border-l border-gray-200 flex flex-col h-full p-8 gap-8">
          {date && (
            <Text type="heading" classNames="mb-4">
              {date}
            </Text>
          )}
          {date &&
            filteredAppointments.map((appointment) => (
              <Card
                heading={appointment.title}
                info={appointment.info}
                side={appointment.time}
              />
            ))}
          {!date && (
            <Text type="paragraph">Select a date to view appointments</Text>
          )}
          {date && filteredAppointments.length === 0 && (
            <Text type="paragraph">No appointments found for this date</Text>
          )}
        </div>
      </div>
    </Main>
  );
};

export default AdvisorDashboard;
