import React from "react";
import Container from "./layout/Container.jsx";
import robot from "./assets/robot.svg";
import Text from "./components/Text.jsx";
import Card from "./components/Card.jsx";
import ChatLine from "./components/ChatLine.jsx";
import Menu from "./components/Menu.jsx";
import Header from "./components/Header.jsx";
import Main from "./layout/Main.jsx";

/*
    Data Needed:
    - Student Details
    - List of Notifications
    - Notification Details
  */

const Notifications = () => {
  return (
    <Main>
      <div class="mb-10 max-h-36">
        <Header
          user="Jared Petersen"
          info="B.Com Computer Science and Information Systems"
          subinfo="2nd Year"
        />
      </div>
      <div class="flex jus flex-auto gap-8 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        <div class="flex w-1/3 flex-col gap-4">
          <Text type="heading" classNames="mb-8">
            Notifications
          </Text>
          <div class="items-center">
            <Card
              heading="Appointment Appoval"
              info="Melissa Densmore"
              side="12:00 PM"
              classNames="mb-6"
            />
            <Card
              heading="Appointment Rejection"
              info="Melissa Densmore"
              side="12:00 PM"
              classNames="mb-6"
              active={true}
            />
          </div>
        </div>
        <div class="flex w-2/3 border-l border-gray-200">
          <div class="flex flex-col flex-auto  gap-8 col-span-2 p-8 m-8  rounded-2xl bg-white shadow-xl">
            <Text type="sm-heading" classNames="mb-8">
              Appointment Rejection
            </Text>
            <Text type="paragraph" classNames="mb-8">
              Hi Jared, Thank you for your enquiry regarding the number of
              electives you need to take. After reviewing your attached
              transcript, I can confirm that you need to complete two more Level
              6 electives. I recommend considering SLL2021F and FTX2000S.
              Additionally, you can refer to SmartAdvisor for more elective
              suggestions. Given the simplicity of this matter, I believe it can
              be resolved via this message, so I have not approved the
              appointment request. Regards, Melissa Densmore
            </Text>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Notifications;
