import React from 'react';
import Text from './Text';

const TextArea = ({
  label,
  placeholder,
  icon,
  disabled,
  classNames,
  onValueChange,
  text,
}) => {
  const handleChange = (event) => {
    if (onValueChange) {
      onValueChange(event.target.value);
    }
  };

  return (
    <div className={`flex flex-col h-full ${classNames}`}>
      {label && (
        <Text classNames="mb-4" type="paragraph">
          {label}
        </Text>
      )}
      <div className="flex flex-auto flex-row items-center">
        <textarea
          className="shadow appearance-none resize-none h-full w-full bg-gray-200 rounded-2xl p-4 text-gray-950 mb-4 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          value={text}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
        />
        {icon && <img src={icon} alt="icon" className="-mx-8 mb-4" />}
      </div>
    </div>
  );
};

export default TextArea;
