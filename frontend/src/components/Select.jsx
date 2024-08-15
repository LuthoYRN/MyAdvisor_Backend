import React from 'react';
import Text from './Text';

const Select = ({label, placeholder, options}) => {
    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div class="flex flex-col w-full">
        {label && <Text classNames="mb-1" type="paragraph">  {label}</Text>}
        <select
            class="shadow appearance-auto my-auto bg-gray-200 rounded-2xl py-2 px-3 text-gray-950 mb-4 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
        >
            {options.map((option) => (
                <option value={option.value}>{option.label}</option>
            ))}
</select>
        </div>
    );
};

export default Select;