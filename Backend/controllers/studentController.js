const { ValidationError, Op } = require("sequelize");

const moment = require("moment"); //for date manipulation
const { sequelize } = require("../db/models");
const {
  advisor,
  student,
  major,
  availability,
  appointment,
  appointmentRequest,
  notification,
  advisorMajor,
} = require("../db/models");

const getAdvisorsForStudent = async (req, res) => {
  try {
    const { studentID } = req.params;

    // Find the student by UUID
    const the_student = await student.findOne({ where: { uuid: studentID } });
    if (!the_student) {
      return res
        .status(404)
        .json({ status: "fail", message: "Student not found" });
    }

    // Find the majors of the student
    const studentMajors = await studentsMajor.findAll({
      where: { studentID: the_student.id },
      attributes: ["majorID"],
    });

    if (!studentMajors || studentMajors.length === 0) {
      // Search under advisor programmes table (implementation needed here)
      return res.status(404).json({
        status: "fail",
        message: "No majors found for this student",
      });
    }

    // Get the list of major IDs
    const majorIDs = studentMajors.map((studentMajor) => studentMajor.majorID);

    // Find advisors associated with those majors and their advised majors
    const advisors = await advisorMajor.findAll({
      where: { majorID: majorIDs },
      attributes: [],
      include: [
        {
          model: advisor,
          attributes: ["uuid", "name", "surname", "office", "profile_url"],
        },
        {
          model: major, // Fetch associated majors
          attributes: ["majorName"],
        },
      ],
    });

    // If no advisors are found
    if (!advisors || advisors.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No advisors found for the student's majors",
      });
    }

    // Use a map to group advisors by their UUID and collect their majors
    const advisorMap = {};

    advisors.forEach((am) => {
      const advisorID = am.advisor.uuid;

      // If the advisor is already in the map, push the new major to the majors array
      if (advisorMap[advisorID]) {
        advisorMap[advisorID].majors.push(am.major.majorName);
      } else {
        // Otherwise, initialize the advisor entry with their details and majors array
        advisorMap[advisorID] = {
          uuid: am.advisor.uuid,
          name: `${am.advisor.name} ${am.advisor.surname}`,
          office: am.advisor.office,
          profile_url: am.advisor.profile_url,
          majors: [am.major.majorName], // Initialize majors as an array
        };
      }
    });

    // Convert the advisorMap object back into an array
    const advisorList = Object.values(advisorMap);

    // Return the advisors in the desired format
    return res.status(200).json({
      status: "success",
      data: advisorList,
    });
  } catch (error) {
    console.error("Error fetching advisors for student:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

const getAdvisorAvailability = async (req, res) => {
  try {
    const { studentID, advisorID } = req.params;
    const { date } = req.query;
    const studentExists = await student.findOne({ where: { uuid: studentID } });
    const advisorExists = await advisor.findOne({ where: { uuid: advisorID } });

    if (!studentExists || !advisorExists) {
      return res
        .status(404)
        .json({ status: "fail", message: "Student or Advisor not found" });
    }
    // Ensure that a date is provided
    if (!date) {
      return res
        .status(400)
        .json({ status: "fail", message: "Date query parameter is required" });
    }

    // Convert the date to a moment object
    const parsedDate = moment(date, "YYYY-MM-DD");

    // Check if the date is valid
    if (!parsedDate.isValid()) {
      return res.status(400).json({ status: "fail", message: "Invalid date" });
    }

    // Check if the date is a weekend (Saturday or Sunday)
    const dayOfWeek = parsedDate.format("dddd"); // 'Monday', 'Tuesday', etc.
    const dayNumber = parsedDate.day(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    if (dayNumber === 0 || dayNumber === 6) {
      // 0 is Sunday, 6 is Saturday
      return res.status(400).json({
        status: "fail",
        message: "Appointments cannot be booked on weekends",
      });
    }

    // Now that we have verified that it's a weekday, fetch availability for that dayOfWeek
    const availabilities = await availability.findOne({
      where: { advisorID: advisorExists.id, dayOfWeek }, // Match dayOfWeek in the advisor's schedule
    });

    if (!availabilities) {
      return res.status(404).json({
        status: "fail",
        message: `No availability found for advisor on ${dayOfWeek}`,
      });
    }

    // Now check the appointments for the selected date to see which times are already booked
    const appointments = await appointment.findAll({
      where: {
        advisorID: advisorExists.id,
        date,
        status: { [Op.not]: "Rejected" }, // Exclude appointments with "Rejected" status
      },
      attributes: ["time"],
    });
    // Get already booked times
    let bookedTimes = appointments.map((appt) => appt.time);
    bookedTimes = bookedTimes.map((time) =>
      moment(time, "HH:mm:ss").format("HH:mm")
    );

    // Filter available times by removing already booked times
    const availableTimes = availabilities.times.filter(
      (time) => !bookedTimes.includes(time)
    );

    return res.status(200).json({
      status: "success",
      data: {
        availableTimes,
      },
    });
  } catch (error) {
    console.error("Error fetching advisor availability:", error.message);
    return res
      .status(500)
      .json({ status: "fail", message: "Internal Server Error" });
  }
};

// Controller for booking an appointment
const bookAppointment = async (req, res) => {
  try {
    const { studentID, advisorID } = req.params;
    const { date, time, comment } = req.body;

    // Check if both student and advisor exist
    const theStudent = await student.findOne({ where: { uuid: studentID } });
    const theAdvisor = await advisor.findOne({ where: { uuid: advisorID } });

    if (!theStudent || !theAdvisor) {
      return res
        .status(404)
        .json({ status: "fail", message: "Student or Advisor not found" });
    }

    // Check if the student has already booked an appointment with the advisor on the same date
    const existingStudentAppointment = await appointment.findOne({
      where: {
        studentID: theStudent.id,
        advisorID: theAdvisor.id,
        date, // Same day
        status: { [Op.not]: "Rejected" }, // Ignore rejected appointments
      },
    });

    if (existingStudentAppointment) {
      return res.status(400).json({
        status: "fail",
        message:
          "You have already booked an appointment with this advisor on the same day.",
      });
    }
    // Check if there's an existing appointment at the same date and time
    const existingAppointment = await appointment.findOne({
      where: {
        advisorID: theAdvisor.id,
        date,
        time,
        status: { [Op.not]: "Rejected" }, // Check for any active or pending appointments
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        status: "fail",
        message: "The selected time slot is already booked.",
      });
    }

    // Create a new appointment with status "Pending"
    const newAppointment = await appointment.create({
      studentID: theStudent.id,
      advisorID: theAdvisor.id,
      date,
      time,
      comment,
      status: "Pending", // Initial status as pending
    });

    // Create a new appointment request for the advisor
    await appointmentRequest.create({
      appointmentID: newAppointment.id,
      is_read: false,
      createdAt: new Date(), // Automatically set to the current time
    });

    return res.status(201).json({
      status: "success",
      message: "Appointment created and is pending advisor confirmation.",
      data: {
        studentID: theStudent.uuid,
        advisorID: theAdvisor.uuid,
      },
    });
  } catch (error) {
    console.error("Error booking appointment:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAdvisorsForStudent,
  getAdvisorAvailability,
  bookAppointment,
};
