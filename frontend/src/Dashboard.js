import React from "react";
import Container from "./layout/Container";
import robot from "./assets/robot.svg";
import Text from "./components/Text";
import Card from "./components/Card";
import ChatLine from "./components/ChatLine.jsx";
import Menu from "./components/Menu.jsx";
import Header from "./components/Header.jsx";
import Main from "./layout/Main";

const Dashboard = () => {
  return (
    <Main>
      <div class="mb-10 max-h-36" >
        <Header
          user="Jared Petersen"
          info="B.Com Computer Science and Information Systems"
          subinfo="2nd Year"
        />
      </div>
      <div class="flex-auto grid grid-cols-2 gap-14 justify-between ">
        <div class="flex flex-col p-8 rounded-2xl bg-white shadow-xl">
          <Text type="heading" classNames="mb-8">
            Upcoming Appointments
          </Text>
          <div class="items-center">
            <Card
              heading="Meeting with Dr. Smith"
              info="Room 307 Computer Science Building"
              side="12:00 PM"
            />
          </div>
        </div>
        <div class="flex flex-col rounded-2xl bg-white shadow-xl h-full">
          <div class="flex p-4  items-center ">
            <img src={robot} alt="SMART Advisor" class="h-1/2" />
            <Text classNames="my-auto" type="heading">
              SMART Advisor
            </Text>
          </div>

          <div class="border-b border-gray-500 p-[-16px]"></div>
          <div class="flex flex-col p-8">
            <ChatLine text="Hi Jared, how can I help you today?" type="chat" />
            <ChatLine text="Hi Jared, how can I help you today?" type="user" />
            <ChatLine text="Hi Jared, how can I help you today?" type="chat" />
            <div class="flex w-4/6 justify-end ml-auto flex-wrap">
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
