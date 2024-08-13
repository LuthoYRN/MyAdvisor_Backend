import React from 'react';

const Button = ({ text, onClick }) => {
    return (
        <button className="bg-slate-900" onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;