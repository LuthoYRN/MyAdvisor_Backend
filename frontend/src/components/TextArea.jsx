import React from 'react';
import Text from './Text';

const TextArea = ({label, placeholder, icon, disabled, classNames}) => {
    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div class={"flex flex-col h-full " + classNames}>
        <Text classNames="mb-4" type="paragraph">  {label}</Text>
        <div class="flex flex-auto flex-row items-center">
        <textarea
            class="shadow appearance-none resize-none h-full w-full bg-gray-200 rounded-2xl p-4 text-gray-950 mb-4 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
        />
        {icon && <img src={icon} alt="icon" class="-mx-8 mb-4" />}
        </div>
        </div>
    );
};

export default TextArea;