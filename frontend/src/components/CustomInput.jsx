import React from 'react';
import Text from './Text';

const CustomInput = ({label, placeholder, icon, classNames}) => {
    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div class={"flex flex-col " + classNames}>
        <Text classNames="mb-1" type="paragraph">  {label}</Text>
        <div class="flex flex-row items-center">
        <input
            class="shadow appearance-none w-full bg-gray-200 rounded-2xl py-2 px-3 text-gray-950 mb-4 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
        />
        {icon && <img src={icon} alt="icon" class="-mx-8 mb-4" />}
        </div>
        </div>
    );
};

export default CustomInput;