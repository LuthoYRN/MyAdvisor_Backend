import React from "react";
import MenuItem from "./MenuItem";
import uct from "../assets/uct.png";
import home from "../assets/home.svg";
import logout from "../assets/logout.svg";
import clock from "../assets/Clock.svg";
import badge from "../assets/badge.svg";
import group from "../assets/groups.svg";
import request from "../assets/request.svg";
import cluster from "../assets/cluster.svg";
import list from "../assets/list.svg";
import notification from "../assets/notificationWhite.svg";
import book from "../assets/book.png";
import rule from "../assets/rule.svg";
import { useNavigate } from "react-router-dom";

const Menu = ({ userType, activeMenuItem }) => {
  let navigate = useNavigate();

  return (
    <div className="flex flex-col h-full my-auto bg-primary rounded-2xl">
      <img className="m-8" src={uct} alt="uct" />
      <div class="flex flex-col h-full justify">
        {userType === "seniorAdvisor" && (
          <>
            <MenuItem
              imageSrc={home}
              text="Home"
              isActive={activeMenuItem === "home"}
              onClick={() => {navigate("/advisorDashboard")}}
            />
            <MenuItem
              imageSrc={group}
              text="My Advice Log"
              isActive={activeMenuItem === "adviceLog"}
              onClick={() => {navigate("/adviceLog")}}
            />
            <MenuItem
              imageSrc={list}
              text="View All Advice Logs"
              isActive={activeMenuItem === "viewAllAdviceLogs"}
            />
            <MenuItem
              imageSrc={clock}
              text="Update Schedule"
              isActive={activeMenuItem === "updateSchedule"}
              onClick={() => {navigate("/updateSchedule")}}
            />
            <MenuItem
              imageSrc={badge}
              text="Manage Majors"
              isActive={activeMenuItem === "manageMajors"}
              onClick={() => {navigate("/curriculumManagement")}}
            />
            <MenuItem
              imageSrc={cluster}
              text="Manage Cluster"
              isActive={activeMenuItem === "manageCluster"}
            />
            <MenuItem
              imageSrc={request}
              text="Appointment Requests"
              isActive={activeMenuItem === "appointmentRequests"}
              onClick={() => {navigate("/appointmentRequests")}}
            />
          </>
        )}
        {userType === "advisor" && (
          <>
            <MenuItem
              imageSrc={home}
              text="Home"
              isActive={activeMenuItem === "home"}
              onClick={() => {navigate("/advisordashboard")}}
            />
            <MenuItem
              imageSrc={group}
              text="Advice Log"
              isActive={activeMenuItem === "adviceLog"}
              onClick={() => {navigate("/advicelog")}}
            />
            <MenuItem
              imageSrc={clock}
              text="Update Schedule"
              isActive={activeMenuItem === "updateSchedule"}
              onClick={() => {navigate("/updateSchedule")}}
            />
            <MenuItem
              imageSrc={badge}
              text="Manage Majors"
              isActive={activeMenuItem === "manageMajors"}
            />
            <MenuItem
              imageSrc={request}
              text="Appointment Requests"
              isActive={activeMenuItem === "appointmentRequests"}
            />
          </>
        )}
        {userType === "student" && (
          <>
            <MenuItem
              imageSrc={home}
              text="Home"
              isActive={activeMenuItem === "home"}
              onClick={() => {navigate("/dashboard")}}
            />
            <MenuItem
              imageSrc={book}
              text="Book Appointment"
              isActive={activeMenuItem === "bookAppointment"}
              onClick={() => {navigate("/bookappointment")}}
            />
            <MenuItem
              imageSrc={notification}
              text="Notifications"
              isActive={activeMenuItem === "notifications"}
              onClick={() => {navigate("/notifications")}}
            />
          </>
        )}
        {userType === "FacultyAdmin" && (
          <>
            <MenuItem
              imageSrc={home}
              text="Home"
              isActive={activeMenuItem === "home"}
            />
            <MenuItem
              imageSrc={group}
              text="Student Advisors"
              isActive={activeMenuItem === "studentAdvisors"}
            />
            <MenuItem
              imageSrc={badge}
              text="Manage Majors"
              isActive={activeMenuItem === "manageMajors"}
            />
            <MenuItem
              imageSrc={rule}
              text="Faculty Rules"
              isActive={activeMenuItem === "facultyRules"}
            />
          </>
        )}
      </div>
      <div class="mb-6">
        <MenuItem
          imageSrc={logout}
          text="Logout"
          isActive={activeMenuItem === "logout"}
        />
      </div>
    </div>
  );
};

export default Menu;
