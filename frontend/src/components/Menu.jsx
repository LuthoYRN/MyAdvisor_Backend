import React from 'react';
import MenuItem from './MenuItem';
import uct from '../assets/uct.png';
import home from '../assets/home.svg';

const Menu = ({ userType, activeMenuItem }) => {

  return (
    <div className="flex flex-col h-full my-auto bg-primary rounded-2xl">
      
      <img className="m-8" src={uct} alt="uct" />
      <div class ="flex flex-col h-full justify">
      {userType === 'seniorAdvisor' && (
        <>
          <MenuItem
            imageSrc={home}
            text="Home"
            isActive={activeMenuItem === 'home'}
          />
          <MenuItem
            imageSrc={home}
            text="My Advice Log"
            isActive={activeMenuItem === 'adviceLog'}
          />
          <MenuItem
            imageSrc={home}
            text="View All Advice Logs"
            isActive={activeMenuItem === 'viewAllAdviceLogs'}
          />
          <MenuItem
            imageSrc={home}
            text="Update Schedule"
            isActive={activeMenuItem === 'updateSchedule'}
          />
          <MenuItem
            imageSrc={home}
            text="Manage Majors"
            isActive={activeMenuItem === 'manageMajors'}
          />
          <MenuItem
            imageSrc={home}
            text="Manage Cluster"
            isActive={activeMenuItem === 'manageCluster'}
          />
          <MenuItem
            imageSrc={home}
            text="Appointment Requests"
            isActive={activeMenuItem === 'appointmentRequests'}
          />
        </>
      )}
      {userType === 'advisor' && (
        <>
          <MenuItem
            imageSrc={home}
            text="Home"
            isActive={activeMenuItem === 'home'}
          />
          <MenuItem
            imageSrc={home}
            text="Advice Log"
            isActive={activeMenuItem === 'adviceLog'}
          />
          <MenuItem
            imageSrc={home}
            text="Update Schedule"
            isActive={activeMenuItem === 'updateSchedule'}
          />
          <MenuItem
            imageSrc={home}
            text="Manage Majors"
            isActive={activeMenuItem === 'manageMajors'}
          />
          <MenuItem
            imageSrc={home}
            text="Appointment Requests"
            isActive={activeMenuItem === 'appointmentRequests'}
          />
        </>
      )}
      {userType === 'student' && (
        <>
          <MenuItem
            imageSrc={home}
            text="Home"
            isActive={activeMenuItem === 'home'}
          />
          <MenuItem
            imageSrc={home}
            text="Book Appointment"
            isActive={activeMenuItem === 'bookAppointment'}
          />
          <MenuItem
            imageSrc={home}
            text="Notifications"
            isActive={activeMenuItem === 'notifications'}
          />
        </>
      )}
      {userType === 'FacultyAdmin' && (
        <>
          <MenuItem
            imageSrc={home}
            text="Home"
            isActive={activeMenuItem === 'home'}
          />
          <MenuItem
            imageSrc={home}
            text="Student Advisors"
            isActive={activeMenuItem === 'studentAdvisors'}
          />
          <MenuItem
            imageSrc={home}
            text="Manage Majors"
            isActive={activeMenuItem === 'manageMajors'}
          />
          <MenuItem
            imageSrc={home}
            text="Faculty Rules"
            isActive={activeMenuItem === 'facultyRules'}
          />
        </>
        )}
        </div>
      <MenuItem
        imageSrc={home}
        text="Logout"
        isActive={activeMenuItem === 'logout'}
      />
    </div>
  );
};

export default Menu;