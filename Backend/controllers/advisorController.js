const { ValidationError } = require("sequelize");
const { sequelize } = require("../db/models");
const {
  advisor,
  faculty,
  availability,
  student,
  course,
  completedCourse,
  major,
  department,
  sharedCourse,
  studentsMajor,
} = require("../db/models");

//To fetch the current schedule of an advisor, including the days of the week and the available time slots for each day
const getAdvisorSchedule = async (req, res) => {
  try {
    const { advisorID } = req.params;
    const the_advisor = await advisor.findOne({
      where: { uuid: advisorID },
    });
    if (!the_advisor) {
      return res
        .status(404)
        .json({ data: "fail", message: "Advisor not found" });
    }

    // Fetch the availability for the advisor
    const availabilities = await availability.findAll({
      where: { advisorID: the_advisor.id },
      attributes: ["dayOfWeek", "times"], // Only fetch dayOfWeek and times
    });

    // If no availability is found for the advisor
    if (!availabilities || availabilities.length === 0) {
      return res.status(200).json({
        status: "success",
        data: [], // Return an empty schedule
      });
    }

    // Format the response data
    const schedule = availabilities.map((availability) => ({
      dayOfWeek: availability.dayOfWeek,
      times: availability.times, // Assuming 'times' is stored as an array of strings
    }));

    // Return the schedule in response
    return res.status(200).json({
      status: "success",
      data: schedule,
    });
  } catch (error) {
    console.error("Error fetching advisor schedule:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = { getAdvisorSchedule, updateAdvisorSchedule };
