import React from "react";
import robot from "./assets/robot.svg";
import Text from "./components/Text.jsx";
import Card from "./components/Card.jsx";
import ChatLine from "./components/ChatLine.jsx";
import Header from "./components/Header.jsx";
import Main from "./layout/Main.jsx";
import Calendar from "./components/Calendar.jsx";

const SeniorAdvisorDashboard = () => {
  return (
    <Main userType={"seniorAdvisor"} activeMenuItem={"home"}>
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
          <Calendar />
        </div>
        <div class="flex flex-col h-full">
          <div class="items-center">
            <Card
              heading="Meeting with Dr. Smith"
              info="Room 307 Computer Science Building"
              side="12:00 PM"
            />
          </div>
        </div>
      </div>
    </Main>
  );
};

export default SeniorAdvisorDashboard;
