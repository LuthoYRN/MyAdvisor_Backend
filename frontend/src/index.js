import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Login from "./Login";
import Signup from "./Signup";
import CourseSelection from "./CourseSelection";
import reportWebVitals from "./reportWebVitals";
import Dashboard from "./Dashboard";
import AppointmentApprove from "./AppointmentApprove";
import UserManagement from "./UserManagement";
import Notifications from "./Notifications";
import AppointmentDate from "./AppointmentDate";
import Appointment from "./Appointment";
import AppointmentAdvisor from "./AppointmentAdvisor";
import AdviceLog from "./AdviceLog";
import MeetingNotes from "./MeetingNotes";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import MeetingRecording from "./MeetingRecording";
import AddCourse from "./AddCourse";
import AdvisorDashboard from "./AdvisorDashboard";
import UpdateSchedule from "./UpdateSchedule";
import AppointmentRequests from "./AppointmentRequests";
import AppointmentDetails from "./AppointmentDetails";
import CurriculumManagement from "./CurriculumManagement";
import AddAdvisor from "./AddAdvisor";
import AddFacultyAdmin from "./AddFacultyAdmin";
import FacultyAdminDashboard from "./FacultyAdminDashboard";
import FacultyRules from "./FacultyRules";
import CourseManagement from "./CourseManagement";
import AllAdviceLog from "./AllAdviceLog";
import ClusterManagement from "./ClusterManagement";
import EditCourse from "./EditCourse";
import AdvisorManagement from "./AdvisorManagement";
import FacultyCurriculumManagement from "./FacultyCurriculumManagement";
import StudentCourses from "./StudentCourses";
import AddCurriculum from "./AddCurriculum";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/advisorDashboard" element={<AdvisorDashboard />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/bookappointment" element={<AppointmentAdvisor />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/appointmentDate" element={<AppointmentDate />} />
      <Route path="/courseSelection" element={<CourseSelection />} />
      <Route path="/appointmentApprove" element={<AppointmentApprove />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/appointmentDetails" element={<AppointmentDetails />} />
      <Route path="/adviceLog" element={<AdviceLog />} />
      <Route path="/meetingNotes" element={<MeetingNotes />} />
      <Route path="/meetingRecording" element={<MeetingRecording />} />
      <Route path="/addCourse" element={<AddCourse />} />
      <Route path="/updateSchedule" element={<UpdateSchedule />} />
      <Route path="/userManagement" element={<UserManagement />} />
      <Route path="/appointmentRequests" element={<AppointmentRequests />} />
      <Route path="/userManagement" element={<UserManagement />} />
      <Route path="/curriculumManagement" element={<CurriculumManagement />} />
      <Route path="/addCourse" element={<AddCourse />} />
      <Route path="/addAdvisor" element={<AddAdvisor />} />
      <Route path="/addFacultyAdmin" element={<AddFacultyAdmin />} />
      <Route
        path="/facultyAdminDashboard"
        element={<FacultyAdminDashboard />}
      />
      <Route path="/facultyRules" element={<FacultyRules />} />
      <Route path="/courseManagement" element={<CourseManagement />} />
      <Route path="/allAdviceLogs" element={<AllAdviceLog />} />
      <Route path="/clusterManagement" element={<ClusterManagement />} />
      <Route path="/editCourse" element={<EditCourse />} />
      <Route path="/advisorManagement" element={<AdvisorManagement />} />
      <Route
        path="/facultyCurriculumManagement"
        element={<FacultyCurriculumManagement />}
      />
      <Route path="/studentCourses" element={<StudentCourses />} />
      <Route path="/addCurriculum" element={<AddCurriculum />} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
