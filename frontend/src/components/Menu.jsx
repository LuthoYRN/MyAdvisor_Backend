import React from 'react';
import MenuItem from './MenuItem';
import uct from '../assets/uct.png';
import home from '../assets/home.svg';

const Menu = ({ userType }) => {
  return (
    <div className="flex flex-col h-full my-auto bg-primary rounded-2xl">
      <img className="m-8" src={uct} alt="uct" />
      {userType === 'admin' && (
        <>
          <MenuItem imageSrc={home} text="Home" isActive={true} />
          {/* Add more menu items for admin */}
        </>
      )}
      {userType === 'student' && (
        <>
          <MenuItem imageSrc={home} text="Home" isActive={true} />
          <MenuItem imageSrc={home} text="Book Appointment" isActive={true} />
          <MenuItem imageSrc={home} text="Notifications" isActive={true} />
        </>
      )}
    </div>
  );
};

export default Menu;