import React from 'react';
import Text from './Text';

const Button = ({ text, onClick }) => {
    return (
        <button class="bg-blue-950 rounded-2xl w-full h-9 text-cente p-2 my-2" onClick={onClick}>
            <Text type="paragraph" color="white">{text}</Text>
        </button>
    );
};

export default Button;