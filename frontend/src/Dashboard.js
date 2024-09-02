import React from "react";
import Container from "./layout/Container";
import account from "./assets/account_circle.svg";
import robot from "./assets/robot.svg";
import Text from "./components/Text";
import uct from "./assets/uct.png";
import notification from "./assets/notification.svg";
import Card from "./components/Card";
import MenuItem from "./components/MenuItem.jsx";
import home from "./assets/home.svg";
import ChatLine from "./components/ChatLine.jsx";

const Dashboard = () => {
  return (
    <div class="flex m-10 gap-10 my-auto py-10 h-svh">
      <div class="col-span-2 row-span-10 max-w-80">
        <div class="flex flex-col h-full my-auto bg-primary  rounded-2xl ">
          <img class="m-8" src={uct} alt="uct" />
          <MenuItem imageSrc={home} text="Home" isActive={true} />
        </div>
      </div>
      <div class="w-full h-full">
        <div>
          <div class="flex items-center h-full bg-white rounded-2xl shadow-xl mb-10">
            <img src={account} alt="account" class="ml-4" />
            <div class="flex flex-col justify-center  p-4 ml-4 my-4 w-full h-5/6">
              <Text type="sm-heading">Jared Petersen</Text>
              <Text type="sm-subheading" classNames="mt-2">
                B.Com Computer Science and Information Systems
              </Text>
              <Text type="sm-subheading">2nd Year</Text>
            </div>
            <img src={notification} alt="notification" class="mr-12" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-14 justify-between ">
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
              <ChatLine
                text="Hi Jared, how can I help you today?"
                type="chat"
              />
              <ChatLine
                text="Hi Jared, how can I help you today?"
                type="user"
              />
               <ChatLine
                text="Hi Jared, how can I help you today?"
                type="chat"
              />
               <ChatLine
                text="Hi Jared, how can I help you today?"
                type="option"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
