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

// API to update the schedule of an advisor
const updateAdvisorSchedule = async (req, res) => {
  try {
    const { advisorID } = req.params;
    const { schedule } = req.body; // Expected format: [{ dayOfWeek: "Monday", times: ["08:00", "09:00", ...]}, ...]

    // Check if the advisor exists
    const advisorExists = await advisor.findOne({
      where: { uuid: advisorID },
    });
    if (!advisorExists) {
      return res
        .status(404)
        .json({ status: "fail", message: "Advisor not found" });
    }

    // Validate the input
    if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
      return res
        .status(400)
        .json({ status: "fail", message: "No valid schedule provided." });
    }

    // Iterate over each dayOfWeek and times in the provided schedule
    for (const daySchedule of schedule) {
      const { dayOfWeek, times } = daySchedule;

      // Ensure that dayOfWeek is provided
      if (!dayOfWeek) {
        continue; // Skip if no valid dayOfWeek is provided
      }

      // Check if an availability record already exists for this advisor and dayOfWeek
      const existingAvailability = await availability.findOne({
        where: { advisorID: advisorExists.id, dayOfWeek },
      });

      if (existingAvailability) {
        // Update existing availability times, set to NULL if empty
        await existingAvailability.update({
          times: times.length === 0 ? null : times,
        });
      } else {
        // Create a new availability record, set times to NULL if empty
        await availability.create({
          advisorID: advisorExists.id,
          dayOfWeek,
          times: times.length === 0 ? null : times,
        });
      }
    }

    // Fetch the updated schedule for the advisor
    const updatedSchedule = await availability.findAll({
      where: { advisorID:advisorExists.id },
      attributes: ["dayOfWeek", "times"],
    });

    // Return the updated schedule in the required format
    return res.status(200).json({
      status: "success",
      data: {
        schedule: updatedSchedule.map((item) => ({
          dayOfWeek: item.dayOfWeek,
          times: item.times,
        })),
      },
    });
  } catch (error) {
    console.error("Error updating schedule:", error.message);
    return res
      .status(500)
      .json({ status: "fail", message: "Internal Server Error" });
  }
};

module.exports = { getAdvisorSchedule, updateAdvisorSchedule };
