const { ValidationError, Op } = require("sequelize");
const { sequelize } = require("../db/models");
const moment = require("moment"); //for date manipulation
const {
  advisor,
  faculty,
  availability,
  student,
  appointment,
  appointmentRequest,
  course,
  completedCourse,
  advisorMajor,
  major,
  department,
  sharedCourse,
  studentsMajor,
} = require("../db/models");

//API to get the advisor's dashboard
const getAdvisorDashboard = async (req, res) => {
  try {
    const { advisorID } = req.params;
    const { date } = req.query; // Check if a date is passed in the query

    // Ensure the advisorID is valid
    if (!advisorID) {
      return res
        .status(400)
        .json({ status: "fail", message: "Advisor ID is required" });
    }

    // Find the advisor by UUID
    const theAdvisor = await advisor.findOne({
      where: { uuid: advisorID },
      attributes: [
        "id",
        "uuid",
        "name",
        "surname",
        "office",
        "profile_url",
        "advisor_level",
      ],
    });

    if (!theAdvisor) {
      return res
        .status(404)
        .json({ status: "fail", message: "Advisor not found" });
    }
    // Fetch majors associated with the advisor
    const advisorMajors = await advisorMajor.findAll({
      where: { advisorID: theAdvisor.id },
      include: [
        {
          model: major,
          attributes: ["majorName"],
        },
      ],
    });
    // Extract major names
    const majors = advisorMajors.map((am) => am.major.majorName);
    // Check if no majors found
    if (majors.length === 0) {
      // If no majors are found, implement logic for advising programmes
      majors = ["Advises programmes (to be implemented)"];
    }
    // Determine the date to use: If a date is provided in the query, use that, otherwise use today's date
    const selectedDate = date ? moment(date, "YYYY-MM-DD", true) : moment();

    // Validate the date (if provided)
    if (date && !selectedDate.isValid()) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    // Get confirmed appointments for the selected date
    const confirmedAppointments = await appointment.findAll({
      where: {
        advisorID: theAdvisor.id, // Use the advisor's ID
        date: selectedDate.format("YYYY-MM-DD"), // Either today's date or the selected date
        status: "Confirmed", // Only get confirmed appointments
      },
      attributes: ["uuid", "studentID", "time"],
      include: [
        {
          model: student,
          attributes: ["name", "surname"],
        },
      ],
    });

    // Get count of unread appointment requests for all appointments linked to the advisor
    const unreadAppointmentRequests = await appointmentRequest.count({
      where: {
        is_read: false,
      },
      include: [
        {
          model: appointment,
          where: {
            advisorID: theAdvisor.id, // Ensure it's linked to the advisor
            status: "Pending",
          },
          attributes: [], // We don't need any attributes from appointment, just linking
        },
      ],
    });

    // Return the advisor info, confirmed appointments, and unread requests
    return res.status(200).json({
      status: "success",
      data: {
        advisor: {
          uuid: theAdvisor.uuid,
          name: `${theAdvisor.name} ${theAdvisor.surname}`,
          office: theAdvisor.office,
          profile_url: theAdvisor.profile_url,
          advisor_level: theAdvisor.advisor_level,
          majors_advised: majors,
        },
        appointments: confirmedAppointments.map((appt) => ({
          id: appt.uuid,
          studentName: `${appt.student.name} ${appt.student.surname}`,
          time: appt.time,
        })),
        unreadAppointmentRequests,
      },
    });
  } catch (error) {
    console.error("Error fetching advisor appointments:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

//API call to get the appointment requests
const getAppointmentRequests = async (req, res) => {
  try {
    const { advisorID } = req.params;
    // Check if advisor exists
    const advisorExists = await advisor.findOne({
      where: { uuid: advisorID },
    });

    if (!advisorExists) {
      return res
        .status(404)
        .json({ status: "fail", message: "Advisor not found" });
    }

    // Fetch appointment requests that are pending for the advisor
    const appointmentRequests = await appointmentRequest.findAll({
      include: [
        {
          model: appointment,
          where: {
            advisorID: advisorExists.id,
            status: "Pending",
          },
          include: [
            {
              model: student,
              attributes: ["name", "surname"],
            },
          ],
        },
      ],
      attributes: ["id", "is_read", "createdAt", "appointmentID"], // Add createdAt for sorting
      order: [["createdAt", "DESC"]], // Order by newest first
    });

    // Map the appointment requests to the desired response format
    const requests = appointmentRequests.map((request) => ({
      id: request.id,
      appointmentID: request.appointment.uuid, // Include appointment UUID
      studentName: `${request.appointment.student.name} ${request.appointment.student.surname}`, // Student full name
      isRead: request.is_read, // Read status
      createdAt: moment(request.createdAt).format("YYYY-MM-DD HH:mm"), // Format createdAt
    }));

    // Return the response
    return res.status(200).json({
      status: "success",
      data: {
        requests, // Return the requests array
      },
    });
  } catch (error) {
    console.error("Error fetching appointment requests:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
//API call to mark a request as read
const markRequestAsRead = async (req, res) => {
  try {
    const { requestID } = req.params;
    // Find the appointment request for the given appointment ID
    const appointmentRequestToMark = await appointmentRequest.findOne({
      where: {
        id: requestID,
        is_read: false, // Only mark if it is unread
      },
    });

    if (!appointmentRequestToMark) {
      return res.status(404).json({
        status: "fail",
        message: "Appointment request not found or already read",
      });
    }

    // Mark the specific appointment request as read
    await appointmentRequestToMark.update({ is_read: true });

    return res.status(200).json({
      status: "success",
      message: "Appointment request marked as read",
    });
  } catch (error) {
    console.error("Error marking request as read:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

//API call to mark all unread appointments as read
const markAllRequestsAsRead = async (req, res) => {
  try {
    const { advisorID } = req.params;

    // Ensure the advisor exists
    const advisorExists = await advisor.findOne({
      where: { uuid: advisorID },
    });

    if (!advisorExists) {
      return res.status(404).json({
        status: "fail",
        message: "Advisor not found",
      });
    }

    // Find and update all unread appointment requests related to the advisor's appointments
    const updatedCount = await appointmentRequest.update(
      { is_read: true }, // Mark all as read
      {
        where: {
          is_read: false, // Only update unread ones
        },
        include: [
          {
            model: appointment,
            where: {
              advisorID: advisorExists.id, // Only appointments linked to this advisor
            },
          },
        ],
      }
    );

    // Return success with the number of requests updated
    return res.status(200).json({
      status: "success",
      message: `${updatedCount[0]} appointment requests marked as read.`,
    });
  } catch (error) {
    console.error("Error marking requests as read:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

//Controller for fetching appointment request details
const getAppointmentRequestDetails = async (req, res) => {
  try {
    const { advisorID, requestID } = req.params;

    // Check if the advisor exists
    const advisorExists = await advisor.findOne({
      where: { uuid: advisorID },
    });

    if (!advisorExists) {
      return res.status(404).json({
        status: "fail",
        message: "Advisor not found",
      });
    }

    // Find the appointment request by requestID
    const appointmentRequestDetails = await appointmentRequest.findOne({
      where: { id: requestID },
      include: [
        {
          model: appointment,
          attributes: ["date", "time", "comment"],
          include: {
            model: student,
            attributes: ["name", "surname"],
          },
        },
      ],
    });

    // If no appointment request is found
    if (!appointmentRequestDetails) {
      return res.status(404).json({
        status: "fail",
        message: "Appointment request not found",
      });
    }

    const attached_appointment = appointmentRequestDetails.appointment;
    const { name, surname } = attached_appointment.student;

    // Format the response
    return res.status(200).json({
      status: "success",
      data: {
        studentName: `${name} ${surname}`,
        date: moment(attached_appointment.date).format("DD MMMM YYYY"),
        time: moment(attached_appointment.time, "HH:mm:ss").format("h:mm a"),
        comment: attached_appointment.comment,
        // File upload details to be implemented later
      },
    });
  } catch (error) {
    console.error("Error fetching appointment request details:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

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
      where: { advisorID: advisorExists.id },
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

module.exports = {
  getAdvisorDashboard,
  getAdvisorSchedule,
  markAllRequestsAsRead,
  markRequestAsRead,
  getAppointmentRequests,
  getAppointmentRequestDetails,
  updateAdvisorSchedule,
};
