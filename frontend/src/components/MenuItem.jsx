import React from 'react';
import Text from './Text';

const MenuItem = ({ imageSrc, text, isActive }) => {
    return (
        <div className={`menu-item mb-2 flex flex-row cursor-pointer ${isActive ? 'active' : ''}`}>
            {isActive && <div className="bg-secondary h-full w-2 mr-6"></div>}
            {!isActive && <div className="h-full w-2 mr-6"></div>}
            <img class="mr-4" src={imageSrc} alt="Menu Item" />
            <Text type="paragraph" color='white'>{text}</Text>
            
        </div>
    );
};

export default MenuItem;