import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Button from "./components/Button";
import video from "./assets/Video.svg";
import FileUploader from "./components/FileUploader";
import TextArea from "./components/TextArea";
import UserCard from "./components/UserCard";
import melissa from "./assets/Melissa.png";
/* 
Data Needed:
- Student Name
- Date
- Time
- Reason for Appointment
- Uploaded Documents

*/

const Appointment = () => {
  return (
    <Main>
      <div className="flex flex-col flex-auto">
        <div class="flex-auto">
          <Text type="heading" classNames="mb-16">
            Appointment Details
          </Text>
          <Text type="sm-heading" classNames="mb-4">
            Choose an advisor
          </Text>
          <div class="overflow-x-scroll flex gap-8 flex-row flex-wrap ">
            <UserCard
              name="Melissa Densmore"
              majors="Computer Science Business Computing"
              office="HPI Lab, 4th Floor, Hasso Plattner School of Design Thinking Afrika"
              image={melissa}
            />
            <UserCard
              name="Melissa Densmore"
              majors="Computer Science Business Computing"
              office="HPI Lab, 4th Floor, Hasso Plattner School of Design Thinking Afrika"
              image={melissa}
            />

            <UserCard
              name="Melissa Densmore"
              majors="Computer Science Business Computing"
              office="HPI Lab, 4th Floor, Hasso Plattner School of Design Thinking Afrika"
              image={melissa}
            />
            
            
          </div>
        </div>
        <div class="flex flex-row gap-8 max-w-md">
          <Button text="Continue" />
          <Button text="Back" type="secondary" />
        </div>
      </div>
    </Main>
  );
};

export default Appointment;
