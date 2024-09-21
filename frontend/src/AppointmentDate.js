import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./components/Button";
import ConfirmationModal from "./components/ConfirmationModal";
import Pill from "./components/Pill";
import Text from "./components/Text";
import CustomCalendar from "./components/customCalendar";
import config from "./config";
import Main from "./layout/Main";
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
  const [loadingTimes, setLoadingTimes] = React.useState(false); // State to track loading status of time slots
  const [alreadyMadeBooking, setAlreadyMadeBooking] = React.useState(false);
  const [proccessing, setProccessing] = React.useState(false);

  let navigate = useNavigate();
  let location = useLocation();

  const handleConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
    setShowSuccessModal(false);
    setAlreadyMadeBooking(false);
    setProccessing(true);

    const handleConfirmationModal = async () => {
      try {
        const formData = new FormData();
        formData.append("date", date); // Add date
        formData.append("time", selectedTime); // Add selected time
        formData.append("comment", location.state.adviceRequired); // Add comment

        // If a file was uploaded, append the file to the formData
        if (location.state.file && location.state.file.length > 0) {
          formData.append("document", location.state.file[0]); // Only append the first file
        }
        // Make the POST request
        const response = await fetch(
          `${config.backendUrl}/api/student/${localStorage.getItem("user_id")}/${location.state.advisor.uuid}/appointment/availability`,
          {
            method: "POST",
            headers: {
              "ngrok-skip-browser-warning": "69420", // Custom header if needed for ngrok
            },
            body: formData, // Pass the formData
          }
        );

        if (response.ok) {
          setShowSuccessModal(true); // Show success modal
          setProccessing(false);
        } else {
          if (
            response.message === "You already have a confirmed appointment."
          ) {
            setAlreadyMadeBooking(true);
            setProccessing(false);
            <ConfirmationModal
              status={"Error"}
              message={response.status}
              onConfirm={"/appointmentDate"}
            />;
          }
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
      setLoadingTimes(true); // Trigger loading state when fetching starts
      try {
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
        const data = await response.json();
        const sortedAvailableTimes = data.data.availableTimes.sort(
          (a, b) => new Date(`1970/01/01 ${a}`) - new Date(`1970/01/01 ${b}`)
        );
        setAvailableSlots(sortedAvailableTimes);
      } catch (error) {
        console.error("Error fetching times:", error);
      } finally {
        setLoadingTimes(false); // Stop loading after fetching or if an error occurs
      }
    };

    fetchTimes();
  }, [date, location.state.advisor.uuid]);

  return (
    <Main userType={"student"} activeMenuItem={"bookAppointment"}>
      <div className="p-8 h-full flex flex-col flex-auto bg-white rounded-2xl">
        <div>
          <Text type="heading" classNames="mb-16">
            Booking Appointment
          </Text>
        </div>
        <div class="h-full flex flex-row gap-72  flex-auto">
          <div class="h-full flex flex-auto flex-col w-1/2 justify-between">
            <div className="mb-6 h-auto ">
              <CustomCalendar onDateSelect={handleDateSelect} />
            </div>
            <div className="mb-6">
              <Button
                text="Book appointment"
                loading={proccessing}
                disabled={proccessing}
                onClick={handleConfirmationModal}
              />
              <Button
                text="Back"
                type="secondary"
                onClick={() => navigate(-1)}
              />
            </div>
          </div>

          <div class="w-1/2 flex-auto">
            <Text type="sm-heading" classNames="mb-4">
              Student Advisor
            </Text>
            <Text type="paragraph" classNames="mb-8">
              {location.state.advisor.name}
            </Text>

            {date && (
              <>
                <Text type="sm-heading" classNames="mb-4">
                  Available Times
                </Text>
                <div className="flex gap-4 mb-8 w-9/12 overflow-auto flex-wrap">
                  {loadingTimes ? (
                    <div className="loader-container ">
                      <div className="loader"></div>{" "}
                    </div>
                  ) : availableTime.length > 0 ? (
                    availableTime.map((time, index) => (
                      <Pill
                        key={index}
                        text={time}
                        active={index === selectedIndex}
                        onClick={() => handleTimeSelect(index)}
                      />
                    ))
                  ) : (
                    <Text type="paragraph" classNames="text-gray-500">
                      No available times
                    </Text>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showConfirmationModal && selectedTime && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8 relative">
            <Text
              type="paragraph-strong"
              onClick={() => setShowConfirmationModal(false)}
              classNames="absolute top-4 right-4 cursor-pointer text-3xl
              text-gray-600 hover:text-gray-900"
            >
              &times;
            </Text>
            <Text type="sm-heading" classNames="mb-4">
              Confirmation
            </Text>
            <Text type="sm-subheading" classNames="mb-8 text-xl">
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
          <div className="bg-white rounded-2xl p-8 relative">
            <div className="flex flex-row items-center gap-2 mb-4">
              <FaTimesCircle className="text-red-500 text-3xl" />
              <Text type="sm-heading" classNames="text-center">
                Error
              </Text>
            </div>
            <Text type="sm-subheading" classNames="mb-8 text-xl">
              Please select a time slot to confirm the appointment
            </Text>
            <Button text="Close" onClick={handleCloseModal} />
          </div>
        </div>
      )}

      {alreadyMadeBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8 relative">
            <div className="flex flex-row items-center gap-2 mb-4">
              <FaTimesCircle className="text-red-500 text-3xl" />
              <Text type="sm-heading" classNames="text-center">
                Error
              </Text>
            </div>
            <Text type="sm-subheading" classNames="mb-8 text-xl">
              You already have a meeting scheduled.
            </Text>
            <Button text="Close" onClick={() => navigate("/dashboard")} />
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-2xl p-8 relative">
            <div className="flex flex-row items-center gap-2 mb-4">
              <FaCheckCircle className="text-green-500 text-3xl" />
              <Text type="sm-heading" classNames="text-center">
                Success
              </Text>
            </div>

            <Text type="sm-subheading" classNames="mb-8 text-xl">
              Booking confirmed successfully
            </Text>
            <Button text="Close" onClick={() => navigate("/dashboard")} />
          </div>
        </div>
      )}
    </Main>
  );
};

export default AppointmentDate;
