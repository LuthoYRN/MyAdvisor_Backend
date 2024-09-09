import React from 'react';
import Text from './Text';

const Button = ({ text, onClick, type, disabled }) => {
    let buttonContent;
    let buttonClassName = '';

    switch (type) {
        case 'primary':
            buttonClassName = 'bg-blue-950 rounded-2xl w-full h-10 text-center p-2 my-2';
            break;
        case 'secondary':
            buttonClassName = 'border border-black rounded-2xl w-full h-10 text-center p-2 my-2';
            break;
        default:
            buttonClassName = 'bg-blue-950 rounded-2xl w-full h-10 text-center p-2 my-2';
            break;
    }

    if (disabled) {
        buttonClassName += ' opacity-50 cursor-not-allowed';
    }

    return buttonContent = (
        <button className={buttonClassName} onClick={onClick} disabled={disabled}>
            <Text type="paragraph" color={disabled ? 'gray' : type === 'secondary' ? 'black': 'white'}>{text}</Text>
        </button>
    );
};

export default Button;