import React from 'react';
import Text from './Text';

const MenuItem = ({ imageSrc, text, isActive }) => {
    return (
        <div className={`menu-item flex flex-row ${isActive ? 'active' : ''}`}>
            {isActive && <div className="bg-secondary h-full w-2 mr-6"></div>}
            <img class="mr-4" src={imageSrc} alt="Menu Item" />
            <Text type="paragraph-strong" color='white'>{text}</Text>
            
        </div>
    );
};

export default MenuItem;