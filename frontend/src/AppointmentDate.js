import React from "react";
import Main from "./layout/Main";
import Text from "./components/Text";
import Button from "./components/Button";
import Pill from "./components/Pill";
import CustomCalendar from "./components/customCalendar";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import config from "./config";

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
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [date, setDate] = React.useState();
  const [selectedTime, setSelectedTime] = React.useState();
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [availableTime, setAvailableSlots] = React.useState([]);

  let navigate = useNavigate();
  let location = useLocation();

  const handleConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
    setShowSuccessModal(false);
    const handleConfirmationModal = async () => {
      try {
        const formData = new FormData();
        formData.append("date", date);
        formData.append("time", selectedTime);
        formData.append("comment", location.state.adviceRequired);
        // Add file upload if needed
        // formData.append("document", file);

        const response = await fetch(
          `${config.backendUrl}/api/student/${localStorage.getItem("user_id")}/${location.state.advisor.uuid}/appointment/availability`,
          {
            method: "POST",
            headers: {
              "ngrok-skip-browser-warning": "69420",
            },
            body: formData,
          }
        );
        if (response.ok) {
          console.log("Appointment booked successfully!");
          // Show confirmation modal
          setShowSuccessModal(true);
        } else {
          // Handle error in appointment booking
          console.error("Error booking appointment:", response.status);
        }
      } catch (error) {
        console.error("Error booking appointment:", error);
      }
    };
    handleConfirmationModal();
  };
  const handleDateSelect = (date) => {
    // Save the date to the database
    setDate(date);
    setSelectedIndex(null);
    setSelectedTime(null);
  };

  const handleTimeSelect = (index) => {
    // Save the time to the database
    setSelectedTime(availableTime[index]);
    setSelectedIndex(index);
  };

  React.useEffect(() => {
    const fetchTimes = async () => {
      try {
        console.log("Fetching advisors...");
        const response = await fetch(
          `${config.backendUrl}/api/student/${localStorage.getItem("user_id")}/${location.state.advisor.uuid}/appointment/availability?date=${date}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        console.log("response", response);
        const data = await response.json();
        setAvailableSlots(data.data.availableTimes);
        console.log("Available Times:", availableTime);
      } catch (error) {
        console.error("Error fetching times:", error);
      }
    };

    fetchTimes();
  }, [date, location.state.advisor.uuid]);

  return (
    <Main userType={"student"} activeMenuItem={"bookAppointment"}>
      <div className=" h-full flex flex-col flex-auto bg-white rounded-2xl">
        <div>
          <Text type="heading" classNames="mb-16 mt-12 ml-16">
            Booking Appointment
          </Text>
        </div>
        <div class="h-full flex flex-row gap-72 flex-auto">
          <div class="h-full flex flex-auto flex-col w-1/2 justify-between">
            <div className="ml-6 p-6 bg-white rounded-lg shadow-lg mb-6 h-auto min-h-[300px] md:min-h-[400px] lg:min-h-[500px]">
              <CustomCalendar onDateSelect={handleDateSelect} />
            </div>
            <div className="ml-6 mb-6">
              <Button
                text="Book appointment"
                onClick={handleConfirmationModal}
              />
              <Button
                text="Back"
                type="secondary"
                onClick={() => navigate("/appointmentDetails")}
              />
            </div>
          </div>

          <div class="w-1/2 flex-auto">
            <Text type="sm-heading" classNames="mb-4">
              Student Advisor
            </Text>
            <Text type="paragraph" classNames="mb-8">
              {/* Replace the placeholder tex with the actual name*/}
              {location.state.advisor.name}
            </Text>
            <Text type="sm-heading" classNames="mb-4">
              Available Times
            </Text>
            <div class="flex gap-4 mb-8 w-9/12 overflow-auto flex-wrap">
              {availableTime &&
                availableTime.map((time, index) => (
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
                  {location.state.advisor.name}
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
                  {location.state.advisor.majors}
                </Text>
                <Text type="paragraph-strong" classNames="mb-2">
                  Office
                </Text>
                <Text type="paragraph" classNames="mb-2">
                  {location.state.advisor.office}
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
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8">
            <Text type="sm-heading" classNames="mb-4">
              Sucess
            </Text>
            <Text type="sm-subheading" classNames="mb-8">
              Booking confirmed successfully
            </Text>
            <Button text="Close" onClick={() => setShowSuccessModal(false)} />
          </div>
        </div>
      )}
    </Main>
  );
};

export default AppointmentDate;
