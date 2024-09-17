const { ValidationError, Op } = require("sequelize");
const { uploadToS3, deleteFromS3 } = require("../utils/s3"); // Import S3 utility functions
const path = require("path");
const fs = require("fs");
const { sequelize } = require("../db/models");
const moment = require("moment"); //for date manipulation
const {
  advisor,
  faculty,
  availability,
  student,
  notification,
  uploadedFile,
  appointment,
  adviceLog,
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
        },
        appointments: confirmedAppointments.map((appt) => ({
          id: appt.uuid,
          studentName: `${appt.student.name} ${appt.student.surname}`,
          time: moment(appt.time, "HH:mm:ss").format("h:mm a"),
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
//API call to update profile picture
const updateProfilePicture = async (req, res) => {
  try {
    const { advisorID } = req.params;

    // Find the advisor record to get the existing profile picture
    const the_advisor = await advisor.findOne({ where: { uuid: advisorID } });
    if (!the_advisor) {
      return res
        .status(404)
        .json({ status: "error", message: "Advisor not found" });
    }

    // If there's an existing profile picture that's not the default, delete it
    const currentProfilePicture = the_advisor.profile_url;
    const isDefaultPicture =
      currentProfilePicture ===
      "https://myadvisor-store.s3.af-south-1.amazonaws.com/profile-pictures/default.png";

    // If there's an existing profile picture that's not the default, delete it
    if (currentProfilePicture && !isDefaultPicture) {
      // Extract the key (file name) from the current profile picture URL
      const currentProfilePictureKey = currentProfilePicture.split(".com/")[1];
      await deleteFromS3(currentProfilePictureKey); // Delete the file from S3
    }
    if (req.file) {
      const fileBuffer = req.file.buffer; // Get file buffer from multer
      const fileName = `profile-pictures/${Date.now()}_${
        req.file.originalname
      }`;
      const mimeType = req.file.mimetype;
      // Upload the new profile picture to S3
      const profilePictureUrl = await uploadToS3(
        fileBuffer,
        fileName,
        mimeType
      );
      // Update the advisor record with the new profile picture relative path
      await advisor.update(
        { profile_url: profilePictureUrl },
        { where: { uuid: advisorID } }
      );
      res.status(200).json({
        status: "success",
        message: "Profile picture updated successfully!",
        data: { profile_url: profilePictureUrl }, // Return the S3 URL to frontend
      });
    } else {
      throw new Error("No file uploaded");
    }
  } catch (error) {
    console.error("Error uploading profile picture:", error.message);
    res
      .status(500)
      .json({ status: "error", message: "Error uploading profile picture" });
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
      createdAt: moment(request.createdAt).fromNow(), // Format createdAt
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

// API call to mark all unread appointment requests as read for an advisor
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

    // Find all unread appointment requests related to the advisor's appointments
    const unreadRequests = await appointmentRequest.findAll({
      include: [
        {
          model: appointment,
          where: {
            advisorID: advisorExists.id, // Only appointments linked to this advisor
          },
        },
      ],
      where: {
        is_read: false, // Only unread requests
      },
    });

    // Mark all unread requests as read
    const updatedCount = await Promise.all(
      unreadRequests.map((request) => request.update({ is_read: true }))
    );

    // Return success with the number of requests updated
    return res.status(200).json({
      status: "success",
      message: `${updatedCount.length} appointment requests marked as read.`,
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
          include: [
            {
              model: student,
              attributes: ["name", "surname"],
            },
            {
              model: uploadedFile,
              as: "uploadedFiles", // Ensure the alias matches the association
              attributes: ["filePathURL", "fileName"], // Include the file URL and name
              where: { uploadedBy: "student" }, // Filter only files uploaded by student
              required: false, // Allow for no uploaded files
            },
          ],
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

    // Safely check if uploadedFiles exists
    const uploadedFiles = attached_appointment.uploadedFiles
      ? attached_appointment.uploadedFiles.map((file) => ({
          fileName: file.fileName,
          fileURL: file.filePathURL,
        }))
      : []; // Default to an empty array if no files are attached

    // Format the response
    return res.status(200).json({
      status: "success",
      data: {
        studentName: `${name} ${surname}`,
        date: moment(attached_appointment.date).format("DD MMMM YYYY"),
        time: moment(attached_appointment.time, "HH:mm:ss").format("h:mm a"),
        comment: attached_appointment.comment,
        documents: uploadedFiles, // Include the uploaded documents in the response
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

//API endpoint for advisor to approve or reject appointment request
const handleAppointmentRequest = async (req, res) => {
  try {
    const { requestID } = req.params;
    const { action } = req.query; // Action could be 'approve' or 'reject'
    // Find the appointment request by requestID
    const appointmentRequestDetails = await appointmentRequest.findOne({
      where: { id: requestID },
      include: {
        model: appointment,
        include: {
          model: student,
          attributes: ["uuid", "name", "surname"],
        },
      },
    });

    if (!appointmentRequestDetails) {
      return res.status(404).json({
        status: "fail",
        message: "Appointment request not found",
      });
    }

    const attached_appointment = appointmentRequestDetails.appointment;

    // Handle Approval
    if (action === "approve") {
      // Update the appointment status to 'Confirmed'
      await attached_appointment.update({
        status: "Confirmed",
      });

      // Send notification to the student
      await notification.create({
        type: "Approval",
        appointmentID: attached_appointment.id,
        message: null, // No message for approval
        is_read: false,
        createdAt: new Date(),
      });

      return res.status(200).json({
        status: "success",
        message: "Appointment approved and student notified.",
      });
    }
    // Handle Rejection
    else if (action === "reject") {
      const { rejectionMessage } = req.body; // Optional rejection message

      // Update the appointment status to 'Rejected'
      await attached_appointment.update({
        status: "Rejected",
      });

      // Send rejection notification to the student
      await notification.create({
        type: "Rejection",
        appointmentID: attached_appointment.id,
        message: rejectionMessage || "Your appointment has been rejected.",
        is_read: false,
        createdAt: new Date(),
      });

      return res.status(200).json({
        status: "success",

        message: "Appointment rejected and student notified.",
      });
    }

    // If action is not provided or invalid
    else {
      return res.status(400).json({
        status: "fail",
        message: "Invalid action. Use ?action=approve or ?action=reject",
      });
    }
  } catch (error) {
    console.error("Error handling appointment request:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

// API to get details of an appointment
const getAppointmentDetails = async (req, res) => {
  try {
    const { advisorID, appointmentID } = req.params;

    // Check if advisor exists
    const advisorExists = await advisor.findOne({
      where: { uuid: advisorID },
    });
    if (!advisorExists) {
      return res.status(404).json({
        status: "fail",
        message: "Advisor not found",
      });
    }

    // Find the appointment details
    const appointmentDetails = await appointment.findOne({
      where: { uuid: appointmentID, advisorID: advisorExists.id },
      include: [
        {
          model: student,
          attributes: ["name", "surname"],
        },
        {
          model: uploadedFile, // Include uploaded files
          as: "uploadedFiles", // Ensure this matches the association
          attributes: ["filePathURL", "fileName"], // Fetch file URL and name
          where: { uploadedBy: "student" }, // Filter only files uploaded by student
          required: false,
        },
      ],
    });

    if (!appointmentDetails) {
      return res.status(404).json({
        status: "fail",
        message: "Appointment not found",
      });
    }

    // Check if the appointment is in the future
    const appointmentDate = moment(appointmentDetails.date).startOf("day");
    const today = moment().startOf("day");
    const isFutureAppointment = appointmentDate.isAfter(today);

    // Check if there's already a log in the adviceLog
    const adviceLogExists = await adviceLog.findOne({
      where: { appointmentID: appointmentDetails.id },
    });

    // Map uploaded files if they exist
    const uploadedFiles = appointmentDetails.uploadedFiles
      ? appointmentDetails.uploadedFiles.map((file) => ({
          fileName: file.fileName,
          fileURL: file.filePathURL,
        }))
      : [];

    // Format the response data
    return res.status(200).json({
      status: "success",
      data: {
        id: appointmentID,
        name: `${appointmentDetails.student.name} ${appointmentDetails.student.surname}`,
        comment: appointmentDetails.comment,
        date: appointmentDetails.date,
        time: appointmentDetails.time,
        isFutureAppointment, // true if the appointment is in the future
        hasAdviceLog: !!adviceLogExists, // true if advice log exists
        uploadedFiles, // List of uploaded files
      },
    });
  } catch (error) {
    console.error("Error fetching appointment details:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
//API to take notes of meeting
const recordMeetingNotes = async (req, res) => {
  try {
    const { advisorID, appointmentID } = req.params;
    const { notes } = req.body;

    // Check if the advisor exists
    const advisorExists = await advisor.findOne({ where: { uuid: advisorID } });
    // Check if the appointment exists and is linked to the advisor
    const appointmentExists = await appointment.findOne({
      where: { uuid: appointmentID, advisorID: advisorExists.id },
    });
    // Create a new advice log
    const newAdviceLog = await adviceLog.create({
      appointmentID: appointmentExists.id,
      notes,
      createdAt: new Date(), // Automatically set the time of creation
    });

    return res.status(201).json({
      status: "success",
      message: "Meeting notes recorded successfully.",
      data: newAdviceLog,
    });
  } catch (error) {
    console.error("Error recording meeting notes:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
//API call to save a video recording of meeting
const recordVideo = async (req, res) => {
  try {
    const { appointmentID } = req.params; // Extract appointmentID from request params

    // Find the appointment by its UUID (appointmentID)
    const appointmentExists = await appointment.findOne({
      where: { uuid: appointmentID }, // Search using UUID
    });

    // If no appointment is found
    if (!appointmentExists) {
      return res.status(404).json({
        status: "fail",
        message: "Appointment not found",
      });
    }

    // Ensure a video file is uploaded
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "No video file uploaded",
      });
    }
    // Upload the video to S3
    const fileBuffer = req.file.buffer; // Get the file buffer from multer
    const fileName = `videos/${Date.now()}_${req.file.originalname}`; // Define a path in the S3 bucket
    const mimeType = req.file.mimetype;

    const videoUrl = await uploadToS3(fileBuffer, fileName, mimeType); // Upload the video to S3
    // Store the video file in the uploadedFile table, linking it to the appointment
    const newVideoRecord = await uploadedFile.create({
      appointmentID: appointmentExists.id, // Store appointment's actual ID from the DB (not UUID)
      fileName: req.file.originalname,
      filePathURL: videoUrl, // Use the S3 URL instead of a relative path
      uploadedBy: "advisor", // Indicates that this file was uploaded by the advisor
    });
    // Create a new advice log entry and associate it with the appointment
    const newAdviceLog = await adviceLog.create({
      appointmentID: appointmentExists.id, // Store appointment's actual ID from the DB
      notes: null,
    });

    return res.status(201).json({
      status: "success",
      message: "Meeting video recorded successfully.",
      data: {
        id: newAdviceLog.id,
        appointmentID: newAdviceLog.appointmentID,
        notes: newAdviceLog.notes,
        createdAt: newAdviceLog.createdAt,
        video: {
          fileName: newVideoRecord.fileName,
          filePathURL: newVideoRecord.filePathURL,
        },
      },
    });
  } catch (error) {
    console.error("Error recording video:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
//API call to get the advisor's advice log
const getLog = async (req, res) => {
  try {
    const { advisorID } = req.params;

    // Check if the advisor exists
    const advisorExists = await advisor.findOne({ where: { uuid: advisorID } });
    if (!advisorExists) {
      return res.status(404).json({
        status: "fail",
        message: "Advisor not found",
      });
    }

    // Fetch all advice logs for the advisor, ordered by createdAt
    const adviceLogs = await adviceLog.findAll({
      where: {
        "$appointment.advisorID$": advisorExists.id, // Ensure it's linked to the advisor
      },
      include: [
        {
          model: appointment,
          include: [
            {
              model: student,
              attributes: ["name", "surname"],
            },
            {
              model: uploadedFile,
              as: "uploadedFiles",
              attributes: ["filePathURL", "fileName"],
              where: { uploadedBy: "advisor" }, // Only fetch advisor's uploaded video
              required: false, // Allow logs with no video
            },
          ],
          attributes: ["date", "time"],
        },
      ],
      order: [["createdAt", "DESC"]], // Sort by createdAt to show latest logs first
    });

    // Map the logs to the response format
    const response = adviceLogs.map((log) => {
      // Check if there are uploaded files (videos), and only assign if notes are null
      const videoFile =
        !log.notes && log.appointment.uploadedFiles
          ? log.appointment.uploadedFiles[0]
          : null;

      return {
        studentName: `${log.appointment.student.name} ${log.appointment.student.surname}`,
        appointmentDate: moment(log.appointment.date).format("DD MMM YYYY"),
        appointmentTime: moment(log.appointment.time, "HH:mm:ss").format(
          "hh:mm A"
        ),
        createdAt: moment(log.createdAt).format("DD MMM YYYY, hh:mm A"),
        type: log.notes ? "Note" : videoFile ? "Video" : "None", // Determine if it's a note or video
        logNotes: log.notes,
        video: videoFile
          ? {
              fileName: videoFile.fileName,
              filePathURL: videoFile.filePathURL,
            }
          : null, // Only show video if there is no note and video exists
      };
    });

    return res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching advisor logs:", error.message);
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
  updateProfilePicture,
  getAppointmentRequests,
  markAllRequestsAsRead,
  markRequestAsRead,
  getAppointmentRequestDetails,
  handleAppointmentRequest,
  getAppointmentDetails,
  recordMeetingNotes,
  recordVideo,
  getLog,
  updateAdvisorSchedule,
  getAdvisorSchedule,
};
