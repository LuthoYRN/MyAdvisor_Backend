import React from 'react';

const CustomInput = () => {
    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <input
            class="rounded-lg border-gray-300"
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Enter your text"
        />
    );
};

export default CustomInput;