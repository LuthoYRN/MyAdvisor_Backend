const { ValidationError, Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const moment = require("moment"); //for date manipulation
const { sequelize } = require("../db/models");
const {
  advisor,
  student,
  major,
  availability,
  appointment,
  studentsMajor,
  department,
  faculty,
  uploadedFile,
  appointmentRequest,
  notification,
  advisorMajor,
} = require("../db/models");

//API call to get student dashboard
const getStudentDashboard = async (req, res) => {
  try {
    const { studentID } = req.params;

    if (!studentID) {
      return res
        .status(400)
        .json({ status: "fail", message: "Student ID is required" });
    }

    // Fetching student information
    const studentData = await student.findOne({
      where: { uuid: studentID },
      attributes: [
        "id",
        "uuid",
        "name",
        "surname",
        "programmeID",
        "profile_url",
      ],
    });

    if (!studentData) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }

    let majorOrProgramme = "";

    // If the student does not have a programme, check majors
    if (!studentData.programmeID) {
      // Fetch the student's majors
      const studentMajors = await studentsMajor.findAll({
        where: { studentID: studentData.id },
        include: [
          {
            model: major,
            attributes: ["majorName"],
            include: [
              {
                model: department,
                attributes: ["facultyID"], // Needed to map to Faculty
                include: [
                  {
                    model: faculty,
                    attributes: ["facultyName"], // Get Faculty Name
                  },
                ],
              },
            ],
          },
        ],
      });

      if (studentMajors.length > 0) {
        // Check if the faculty is "Science"
        const facultyName =
          studentMajors[0].major.department.faculty.facultyName;
        let majorPrefix = "";
        // Append "BSc" if the faculty is "Science"
        if (facultyName === "Science") {
          majorPrefix = "BSc ";
        }
        // Concatenate major names
        const majorsWithFaculty = studentMajors.map(
          (maj) => maj.major.majorName
        );
        // Join all major names into a single string
        majorOrProgramme = majorPrefix + majorsWithFaculty.join(" & ");
      } else {
        majorOrProgramme = "No major found";
      }
    } else {
      // If programmeID exists, to be implemented later
      majorOrProgramme = "Programmes to be added";
    }

    // Get today's date and time
    const today = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("HH:mm:ss");

    // Fetch past appointments (confirmed and before the current date)
    const pastAppointments = await appointment.findAll({
      where: {
        studentID: studentData.id,
        status: "Confirmed",
        date: { [Op.lt]: today }, // Less than today's date
      },
      include: [
        {
          model: advisor,
          attributes: ["name", "office"], // Include advisor's details
        },
      ],
      order: [["date", "DESC"]], // Order by date descending
    });

    // Fetch upcoming appointments (confirmed and on or after today, and current time)
    const upcomingAppointments = await appointment.findAll({
      where: {
        studentID: studentData.id,
        status: "Confirmed",
        [Op.or]: [
          {
            date: { [Op.gt]: today }, // Dates after today
          },
          {
            date: today, // Appointments on today but after current time
            time: { [Op.gte]: currentTime },
          },
        ],
      },
      include: [
        {
          model: advisor,
          attributes: ["name", "office"], // Include advisor's details
        },
      ],
      order: [
        ["date", "ASC"],
        ["time", "ASC"],
      ], // Order by date and time ascending
    });

    // Fetch unread notifications count
    const unreadNotifications = await notification.count({
      where: {
        is_read: false,
      },
      include: [
        {
          model: appointment,
          where: {
            studentID: studentData.id, // Ensure it's linked to the student
          },
          attributes: [], // We don't need any attributes from appointment, just linking
        },
      ],
    });

    // Formatting and sending the response
    return res.status(200).json({
      status: "success",
      data: {
        student: {
          id: studentData.uuid,
          name: studentData.name,
          surname: studentData.surname,
          profile_url: studentData.profile_url,
          majorOrProgramme, // Return the concatenated major or the programme placeholder
        },
        pastAppointments: pastAppointments.map((appt) => ({
          advisorName: appt.advisor.name,
          date: appt.date,
          time: appt.time,
          office: appt.advisor.office,
        })),
        upcomingAppointments: upcomingAppointments.map((appt) => ({
          advisorName: appt.advisor.name,
          date: appt.date,
          time: appt.time,
          office: appt.advisor.office,
        })),
        unreadNotifications,
      },
    });
  } catch (error) {
    console.error("Error fetching student dashboard:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

//API call to update profile picture
const updateProfilePicture = async (req, res) => {
  try {
    const { studentID } = req.params;

    // Find the student record to get the existing profile picture
    const the_student = await student.findOne({ where: { uuid: studentID } });
    if (!the_student) {
      return res
        .status(404)
        .json({ status: "error", message: "Student not found" });
    }

    // If there's an existing profile picture that's not the default, delete it
    const currentProfilePicture = the_student.profile_url;
    const isDefaultPicture =
      currentProfilePicture === "/db/uploads/profile-pictures/default.png";

    if (currentProfilePicture && !isDefaultPicture) {
      // Construct the absolute path to the old profile picture
      const oldPicturePath = path.join(__dirname, "..", currentProfilePicture);
      // Delete the old profile picture (silently handle any errors)
      fs.unlink(oldPicturePath, (err) => {
        // Silently handle any error, no need to log
      });
    }
    // Construct the relative path for the new profile picture
    const newProfilePicture = req.file
      ? `/db/uploads/profile-pictures/${req.file.filename}`
      : null;

    if (!newProfilePicture) {
      throw new Error("No file uploaded");
    }

    // Update the student record with the new profile picture relative path
    await student.update(
      { profile_url: newProfilePicture },
      { where: { uuid: studentID } }
    );

    res.status(200).json({
      status: "success",
      message: "Profile picture updated successfully!",
      data: { profile_url: newProfilePicture }, // Return the relative path to the frontend
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error uploading profile picture",
    });
  }
};
//Get all notifications
const getStudentNotifications = async (req, res) => {
  try {
    const { studentID } = req.params;
    // Check if the student exists
    const studentExists = await student.findOne({ where: { uuid: studentID } });
    if (!studentExists) {
      return res
        .status(404)
        .json({ status: "fail", message: "Student not found" });
    }

    // Fetch all notifications for the student, order by createdAt descending
    const notifications = await notification.findAll({
      include: {
        model: appointment,
        where: { studentID: studentExists.id }, // Link notifications to student via appointments
        attributes: ["uuid", "date", "time", "advisorID"],
        include: {
          model: advisor,
          attributes: ["name", "surname", "office"],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    // Map notifications to the response format
    const response = notifications.map((notif) => {
      // If it's a rejection notification, only return the rejection message without appointment details
      if (notif.type === "Rejection") {
        return {
          id: notif.id,
          type: notif.type,
          isRead: notif.is_read,
          message: notif.message, // This could be the reason for rejection
          createdAt: moment(notif.createdAt).fromNow(), // e.g., "2 hours ago"
        };
      }

      // If it's not a rejection, return the full appointment details
      return {
        id: notif.id,
        type: notif.type,
        isRead: notif.is_read,
        message: notif.message, // This could be null for approvals
        createdAt: moment(notif.createdAt).fromNow(), // e.g., "2 hours ago"
        appointment: {
          advisorName: `${notif.appointment.advisor.name} ${notif.appointment.advisor.surname}`,
          office: notif.appointment.advisor.office,
          date: moment(notif.appointment.date).format("DD MMMM YYYY"),
          time: moment(notif.appointment.time, "HH:mm:ss").format("hh:mm A"),
        },
      };
    });

    return res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
//mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { studentID } = req.params;

    // Check if the student exists
    const studentExists = await student.findOne({ where: { uuid: studentID } });

    if (!studentExists) {
      return res
        .status(404)
        .json({ status: "fail", message: "Student not found" });
    }

    // Find all unread notifications for the student
    const unreadNotifications = await notification.findAll({
      include: {
        model: appointment,
        where: { studentID: studentExists.id }, // Only for this student
      },
      where: {
        is_read: false, // Only unread notifications
      },
    });

    // Update all unread notifications to mark them as read
    await Promise.all(
      unreadNotifications.map((notif) => notif.update({ is_read: true }))
    );

    return res.status(200).json({
      status: "success",
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};
// API call to mark a single notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const { studentID, notificationID } = req.params;

    // Check if the student exists
    const studentExists = await student.findOne({ where: { uuid: studentID } });
    if (!studentExists) {
      return res
        .status(404)
        .json({ status: "fail", message: "Student not found" });
    }

    // Find the notification linked to the student and appointment
    const notificationToMark = await notification.findOne({
      where: { id: notificationID, is_read: false },
      include: {
        model: appointment,
        where: { studentID: studentExists.id }, // Ensure the notification is for this student
      },
    });

    if (!notificationToMark) {
      return res.status(404).json({
        status: "fail",
        message: "Notification not found or already marked as read",
      });
    }

    // Mark the notification as read
    await notificationToMark.update({ is_read: true });

    return res.status(200).json({
      status: "success",
      message: "Notification marked as read.",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
};

//API call to get all advisors for the student's majors
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

//API call to get an advisor's available times based on queried date
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

    if (req.file) {
      const documentUrl = `/db/uploads/documents/${req.file.filename}`;

      // Create a new uploadedFile record linked to the appointment
      await uploadedFile.create({
        appointmentID: newAppointment.id,
        filePathURL: documentUrl,
        fileName: req.file.originalname,
      });
    }

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
  getStudentDashboard,
  updateProfilePicture,
  getStudentNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  getAdvisorsForStudent,
  getAdvisorAvailability,
  bookAppointment,
};
