import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Button from "./components/Button";
import video from "./assets/Video.svg";
import Pill from "./components/Pill";
import Calendar from "./components/Calendar";

/* 
Data Needed:
- Student Name
- Date
- Time
- Reason for Appointment
- Uploaded Documents

*/

const AppointmentDate = () => {
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [value, onChange] = React.useState();
  const [date, setDate] = React.useState();
  const [selectedTime, setSelectedTime] = React.useState();
  const [selectedIndex, setSelectedIndex] = React.useState();

  const handleConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
  };
  const handleDateSelect = (date) => {
    // Save the date to the database
    setDate(date.startStr);
    setSelectedIndex(null);
    setSelectedTime(null);
  };

  const handleTimeSelect = (index) => {
    // Save the time to the database
    setSelectedTime(availableTimes[index]);
    setSelectedIndex(index);
  };

  const availableSlots = [
    {
      date: "2024-09-09",
      times: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM"],
    },
    { date: "2024-09-10", times: ["02:00 PM", "03:00 PM", "04:00 PM"] },
    { date: "2024-09-11", times: ["09:00 AM", "10:00 AM", "11:00 AM"] },
    { date: "2024-09-12", times: ["02:00 PM", "03:00 PM", "04:00 PM"] },
    { date: "2024-09-13", times: ["09:00 AM", "10:00 AM", "11:00 AM"] },
    {
      date: "2024-09-14",
      times: ["10:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
    },
    { date: "2024-09-15", times: ["09:00 AM", "10:00 AM", "11:00 AM"] },
    { date: "2024-09-16", times: ["02:00 PM", "03:00 PM", "04:00 PM"] },
    { date: "2024-09-17", times: ["09:00 AM", "10:00 AM", "11:00 AM"] },
    { date: "2024-09-18", times: ["02:00 PM", "03:00 PM", "04:00 PM"] },

    // Add more objects for other dates and times
  ];

  const selectedDateSlots = availableSlots.find((slot) => slot.date === date);
  const availableTimes = selectedDateSlots ? selectedDateSlots.times : [];

  return (
    <Main userType={"student"} activeMenuItem={"bookAppointment"}>
      <div className="flex flex-col flex-auto">
        <Text type="heading" classNames="mb-16">
          Appointment Details
        </Text>

        <div class="flex gap-72 flex-auto">
          <div class="flex flex-auto flex-col w-1/2 justify-between">
            <div>
              <Calendar onDateSelect={handleDateSelect} />
            </div>
            <div>
              <Button
                text="Book appointment"
                onClick={handleConfirmationModal}
              />
              <Button text="Back" type="secondary" />
            </div>
          </div>

          <div class="w-1/2 flex-auto">
            <Text type="sm-heading" classNames="mb-4">
              Student Advisor
            </Text>
            <Text type="paragraph" classNames="mb-8">
              {/* Replace the placeholder tex with the actual name*/}
              John Doe
            </Text>
            <Text type="sm-heading" classNames="mb-4">
              Available Times
            </Text>
            <div class="flex gap-4 mb-8">
              {availableTimes.map((time, index) => (
                <Pill
                  key={index}
                  text={time}
                  active={index === selectedIndex}
                  onClick={() => handleTimeSelect(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {showConfirmationModal && selectedTime && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8">
            <Text type="sm-heading" classNames="mb-4">
              Confirmation
            </Text>
            <Text type="sm-subheading" classNames="mb-8">
              Click confirm to finalize the appointment details{" "}
            </Text>
            <div className="grid grid-cols-2 gap-8 mb-4 max-w-96">
              <div>
                <Text type="paragraph-strong" classNames="mb-2">
                  Student Advisor
                </Text>
                <Text type="paragraph" classNames="mb-2">
                  John Doe
                </Text>
                <Text type="paragraph-strong" classNames="mb-2">
                  Date
                </Text>
                <Text type="paragraph" classNames="mb-2">
                  {date}
                </Text>
                <Text type="paragraph-strong" classNames="mb-2">
                  Time
                </Text>
                <Text type="paragraph" classNames="mb-2">
                  {selectedTime}
                </Text>
              </div>
              <div>
                <Text type="paragraph-strong" classNames="mb-2">
                  Major(s)
                </Text>
                <Text type="paragraph" classNames="mb-2">
                  Computer Science Business Computing
                </Text>
                <Text type="paragraph-strong" classNames="mb-2">
                  Office
                </Text>
                <Text type="paragraph" classNames="mb-2">
                  HPI Lab, 4th Floor, Hasso Plattner School of Design Thinking
                  Afrika
                </Text>
              </div>
            </div>
            <Button text="Confirm" onClick={handleCloseModal} />
          </div>
        </div>
      )}
      {showConfirmationModal && !selectedTime && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8">
            <Text type="sm-heading" classNames="mb-4">
              Error
            </Text>
            <Text type="sm-subheading" classNames="mb-8">
              Please select a time slot to confirm the appointment
            </Text>
            <Button text="Close" onClick={handleCloseModal} />
          </div>
        </div>
      )}
    </Main>
  );
};

export default AppointmentDate;
