import React from "react";
import Text from "./components/Text.jsx";
import Main from "./layout/Main.jsx";
import TextArea from "./components/TextArea.jsx";
import Button from "./components/Button.jsx";
import Pill from "./components/Pill.jsx";

/*
    Data Needed:
    - Save Meeting Notes
  */

const MeetingNotes = () => {
  const [selectedTimes, setSelectedTimes] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [times, setTimes] = React.useState([
    { Monday: ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00", "17:00"] },
    {
      Tuesday: [
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
      ],
    },
    {
      Wednesday: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "17:00",
      ],
    },
    {
      Thursday: [
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
      ],
    },
    {
      Friday: [
        "08:00",
        "09:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
      ],
    },
  ]);

  const handleSelectDate = (text) => {
    setSelectedDate(text);
    setSelectedTimes([]);

    // Load the times of the corresponding day
    const selectedDay = times.find((day) => Object.keys(day)[0] === text);
    if (selectedDay) {
      const dayTimes = selectedDay[text];
      setSelectedTimes(dayTimes);
    }
  };

  const handleSaveNotes = () => {
    // TODO: Save notes to the database
  };

  const handleSelectPill = (text) => {
    if (selectedTimes.includes(text)) {
      setSelectedTimes(selectedTimes.filter((time) => time !== text));
    } else {
      setSelectedTimes([...selectedTimes, text]);
    }
  };
  
  React.useEffect(() => {
    const updatedTimes = times.map((day) => {
      const dayName = Object.keys(day)[0];
      if (selectedDate.includes(dayName)) {
        return { [dayName]: selectedTimes };
      }
      return day;
    });
    setTimes(updatedTimes);
  }, [selectedDate, selectedTimes]);

  return (
    <Main userType={"advisor"} activeMenuItem={"updateSchedule"}>
      <div class="flex flex-col flex-auto gap-8 col-span-2 p-8 rounded-2xl bg-white shadow-xl">
        <Text type="heading" classNames="mb-4">
          Update Schedule
        </Text>
        <div class="flex flex-col flex-auto justify-between">
          <div class="flex flex-row justify-between">
            <div class="flex flex-col border border-gray-200 rounded-2xl p-8 gap-4 w-5/12 mr-32">
              <Text type="sm-heading" classNames="mb-4">
                Days of the weeks
              </Text>
              <Pill
                text="Monday"
                onClick={() => handleSelectDate("Monday")}
                active={selectedDate.includes("Monday")}
              />
              <Pill
                text="Tuesday"
                onClick={() => handleSelectDate("Tuesday")}
                active={selectedDate.includes("Tuesday")}
              />
              <Pill
                text="Wednesday"
                onClick={() => handleSelectDate("Wednesday")}
                active={selectedDate.includes("Wednesday")}
              />
              <Pill
                text="Thursday"
                onClick={() => handleSelectDate("Thursday")}
                active={selectedDate.includes("Thursday")}
              />
              <Pill
                text="Friday"
                onClick={() => handleSelectDate("Friday")}
                active={selectedDate.includes("Friday")}
              />
            </div>
            <div class="flex flex-col">
              <Text type="sm-heading" classNames="mb-4">
                Select Available times
              </Text>
              <div class="flex-row flex h-fit flex-wrap w-7/12 gap-4">
                <Pill
                  text="08:00"
                  onClick={() => handleSelectPill("08:00")}
                  active={selectedTimes.includes("08:00")}
                />
                <Pill
                  text="09:00"
                  onClick={() => handleSelectPill("09:00")}
                  active={selectedTimes.includes("09:00")}
                />
                <Pill
                  text="10:00"
                  onClick={() => handleSelectPill("10:00")}
                  active={selectedTimes.includes("10:00")}
                />
                <Pill
                  text="11:00"
                  onClick={() => handleSelectPill("11:00")}
                  active={selectedTimes.includes("11:00")}
                />
                <Pill
                  text="12:00"
                  onClick={() => handleSelectPill("12:00")}
                  active={selectedTimes.includes("12:00")}
                />
                <Pill
                  text="13:00"
                  onClick={() => handleSelectPill("13:00")}
                  active={selectedTimes.includes("13:00")}
                />
                <Pill
                  text="14:00"
                  onClick={() => handleSelectPill("14:00")}
                  active={selectedTimes.includes("14:00")}
                />
                <Pill
                  text="15:00"
                  onClick={() => handleSelectPill("15:00")}
                  active={selectedTimes.includes("15:00")}
                />
                <Pill
                  text="16:00"
                  onClick={() => handleSelectPill("16:00")}
                  active={selectedTimes.includes("16:00")}
                />
                <Pill
                  text="17:00"
                  onClick={() => handleSelectPill("17:00")}
                  active={selectedTimes.includes("17:00")}
                />
              </div>
            </div>
          </div>
          <div class="flex flex-row gap-8 max-w-md">
            <Button text="Save" onClick={handleSaveNotes} />
            <Button text="Back" type="secondary" />
          </div>
        </div>
      </div>
    </Main>
  );
};

export default MeetingNotes;
