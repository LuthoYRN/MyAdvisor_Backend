import React from "react";
import Text from "./components/Text.jsx";
import Main from "./layout/Main.jsx";
import Button from "./components/Button.jsx";
import Pill from "./components/Pill.jsx";
import config from "./config.js";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./components/ConfirmationModal.jsx";

const MeetingNotes = () => {
  const [selectedTimes, setSelectedTimes] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [times, setTimes] = React.useState([]);
  const [successModal, setSuccessModal] = React.useState(false);
  let navigate = useNavigate();

  const handleSelectDate = (text) => {
    setSelectedDate(text);
    setSelectedTimes([]);

    // Load the times of the corresponding day
    const selectedDay = times.find((day) => Object.keys(day)[0] === text);
    if (selectedDay && selectedDay[text]) {
      const dayTimes = selectedDay[text];
      setSelectedTimes(dayTimes);
    } else {
      setSelectedTimes([]);
    }
  };

  const handleSaveSchedule = () => {
    const saveSchedule = async () => {
      try {
        // Ensure that we convert null values to empty arrays before sending the request
        const formattedSchedule = times.map((day) => {
          const dayOfWeek = Object.keys(day)[0];
          const timesForDay = day[dayOfWeek] || []; // Ensure it sends [] instead of null

          return {
            dayOfWeek,
            times: timesForDay,
          };
        });

        const response = await fetch(
          `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/schedule`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ schedule: formattedSchedule }),
          }
        );

        const result = await response.json();
        if (response.ok) {
          setSuccessModal(true);
        } else {
          console.error("Failed to save schedule:", result);
        }
      } catch (error) {
        console.error("Error saving schedule:", error);
      }
    };

    saveSchedule();
  };

  const handleSelectPill = (text) => {
    let updatedTimes;

    if (selectedTimes.includes(text)) {
      // Deselecting a time
      updatedTimes = selectedTimes.filter((time) => time !== text);
    } else {
      // Selecting a new time
      updatedTimes = [...selectedTimes, text];
    }

    // Update the selected times state
    setSelectedTimes(updatedTimes);

    // Also update the overall schedule state (`times`) for the selected day
    setTimes((prevTimes) => {
      const updatedTimesArray = [...prevTimes];

      // Find the index of the day in the `times` array
      const dayIndex = updatedTimesArray.findIndex(
        (day) => Object.keys(day)[0] === selectedDate
      );

      if (dayIndex >= 0) {
        // If day already exists in the `times`, update it
        updatedTimesArray[dayIndex][selectedDate] = updatedTimes;
      } else {
        // If day doesn't exist, add it
        updatedTimesArray.push({ [selectedDate]: updatedTimes });
      }

      return updatedTimesArray;
    });
  };

  React.useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(
          `${config.backendUrl}/api/advisor/${localStorage.getItem("user_id")}/schedule`
        );
        const result = await response.json();
        if (result.status === "success") {
          const fetchedTimes = result.data.map((day) => ({
            [day.dayOfWeek]: day.times,
          }));
          setTimes(fetchedTimes);
        }
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule();
  }, []);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timesOfDay = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  return (
    <Main
      userType={
        JSON.parse(localStorage.getItem("userData")).advisor.advisor_level
      }
      activeMenuItem={"updateSchedule"}
    >
      <div className="flex flex-col flex-auto gap-8 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        <Text type="heading" classNames="mb-4">
          Update Schedule
        </Text>
        <div className="flex flex-col flex-auto justify-between">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col border border-gray-200 rounded-2xl p-8 gap-4 w-5/12 mr-32">
              <Text type="sm-heading" classNames="mb-4">
                Days of the week
              </Text>
              {daysOfWeek.map((day) => (
                <Pill
                  key={day}
                  text={day}
                  onClick={() => handleSelectDate(day)}
                  active={selectedDate.includes(day)}
                />
              ))}
            </div>
            <div className="flex flex-col">
              <Text type="sm-heading" classNames="mb-4">
                Select Available times
              </Text>
              <div className="flex-row flex h-fit flex-wrap w-7/12 gap-4">
                {timesOfDay.map((time) => (
                  <Pill
                    key={time}
                    text={time}
                    onClick={() => handleSelectPill(time)}
                    active={selectedTimes.includes(time)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-8 max-w-md">
            <Button text="Save" onClick={handleSaveSchedule} />
            <Button
              text="Back"
              type="secondary"
              onClick={() => navigate("/advisorDashboard")}
            />
          </div>
        </div>
      </div>
      {successModal && (
        <ConfirmationModal
          status={"Success"}
          message={"Schedule updated successfully."}
          close={() => setSuccessModal(false)}
        />
      )}
    </Main>
  );
};

export default MeetingNotes;
