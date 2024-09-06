import React from 'react';
import Text from './Text';

const Button = ({ text, onClick, type }) => {
    let buttonContent;

    switch (type) {
        case 'primary':
            buttonContent = (
                <button className="bg-blue-950 rounded-2xl w-full h-10 text-center p-2 my-2" onClick={onClick}>
                    <Text type="paragraph" color="white">{text}</Text>
                </button>
            );
            break;
        case 'secondary':
            buttonContent = (
                <button className="border border-black rounded-2xl w-full h-10 text-center p-2 my-2" onClick={onClick}>
                    <Text type="paragraph">{text}</Text>
                </button>
            );
            break;
        default:
            buttonContent = (
                <button className="bg-blue-950 rounded-2xl w-full h-10 text-center p-2 my-2" onClick={onClick}>
                    <Text type="paragraph" color="white">{text}</Text>
                </button>
            );
            break;
    }

    return buttonContent;
};

export default Button;