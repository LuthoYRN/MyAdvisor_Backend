import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import Login from "./Login";
import Signup from "./Signup";
import CourseSelection from "./CourseSelection";
import reportWebVitals from "./reportWebVitals";
import Dashboard from "./Dashboard";
import AppointmentDetails from "./AppointmentDetails";
import UserManagement from "./UserManagement";
import Notifications from "./Notifications";
import AppointmentDate from "./AppointmentDate";
import Appointment from "./Appointment";
import AppointmentAdvisor from "./AppointmentAdvisor";
import AdviceLog from "./AdviceLog";
import MeetingNotes from "./MeetingNotes";
import MeetingRecording from "./MeetingRecording";
import AddCourse from "./AddCourse";
import AdvisorDashboard from "./AdvisorDashboard";
import UpdateSchedule from "./UpdateSchedule";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/bookappointment" element={<AppointmentAdvisor />} />
      <Route path="/appointmentDetails" element={<Appointment />} />
      <Route path="/appointmentDate" element={<AppointmentDate />} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
