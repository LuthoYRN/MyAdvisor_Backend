import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isBefore,
  isWeekend,
  isToday,
  getMonth,
} from "date-fns";

export default function CustomCalendar({ onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // Tracks selected date

  // Get the start and end date for the calendar grid (includes days from previous/next months)
  const startDate = startOfWeek(startOfMonth(currentDate));
  const endDate = endOfWeek(endOfMonth(currentDate));

  // Handle navigating to the previous and next months
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (day) => {
    // Disable past days and weekends, but not today
    if ((isBefore(day, new Date()) && !isToday(day)) || isWeekend(day)) return;

    // Set the new selected day and notify the parent component
    setSelectedDate(format(day, "yyyy-MM-dd"));
    onDateSelect(format(day, "yyyy-MM-dd"));
  };

  // Render the days of the month in a grid
  const renderDays = () => {
    const days = [];
    let day = startDate; // Start from the first day of the calendar grid (which may include previous month)
    while (day <= endDate) {
      const formattedDate = format(day, "d");
      const isSelected =
        selectedDate &&
        format(selectedDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
      const isDisabled =
        (isBefore(day, new Date()) && !isToday(day)) || isWeekend(day); // Disable past days and weekends
      let new_day = day;
      days.push(
        <div
          key={day}
          className={`flex items-center justify-center w-12 h-12 rounded-full cursor-pointer 
            ${isSelected ? "bg-primary text-white" : isDisabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-800 hover:bg-primary hover:text-white"}
          `}
          onClick={() => handleDateClick(new_day)}
        >
          {formattedDate}
        </div>
      );

      day = addDays(day, 1); // Move to the next day
    }
    return days;
  };

  // Render the header (month/year navigation)
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-200 rounded-t-lg">
        <button
          className="text-gray-600 hover:text-gray-800"
          onClick={handlePrevMonth}
        >
          &lt; Prev
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          className="text-gray-600 hover:text-gray-800"
          onClick={handleNextMonth}
        >
          Next &gt;
        </button>
      </div>
    );
  };

  // Render the weekdays (Sun, Mon, etc.)
  const renderWeekdays = () => {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekdays.map((day) => (
      <div
        key={day}
        className="flex items-center justify-center w-12 h-12 text-gray-600 font-semibold"
      >
        {day}
      </div>
    ));
  };

  // Render the entire calendar
  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      {renderHeader()}
      <div className="grid grid-cols-7 gap-2 mt-4">
        {renderWeekdays()}
        {renderDays()}
      </div>
    </div>
  );
}
