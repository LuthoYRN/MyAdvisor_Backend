import React from 'react';
import MenuItem from './MenuItem';
import uct from '../assets/uct.png';
import home from '../assets/home.svg';

const Menu = () => {
    return (
        <div class="flex flex-col h-full my-auto bg-primary  rounded-2xl ">
        <img class="m-8" src={uct} alt="uct" />
        <MenuItem imageSrc={home} text="Home" isActive={true} />
      </div>
    );
};

export default Menu;