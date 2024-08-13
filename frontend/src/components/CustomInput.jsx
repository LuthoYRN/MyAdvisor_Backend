import React from 'react';
import Text from './Text';

const CustomInput = ({label}) => {
    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div class="flex flex-col">
        <Text classNames="mb-1" type="paragraph">  {label}</Text>
        <input
            class="shadow appearance-none bg-gray-200 rounded-2xl py-2 px-3 text-gray-950 mb-4 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Enter your text"
        />
        </div>
    );
};

export default CustomInput;