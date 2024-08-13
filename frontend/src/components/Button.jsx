import React from 'react';

const Button = ({ text, onClick }) => {
    return (
        <button class="bg-blue-950 rounded-2xl w-full text-white p-2 my-2" onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;