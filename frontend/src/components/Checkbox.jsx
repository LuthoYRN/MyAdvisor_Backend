import React, { useState } from 'react';

const Checkbox = (classNames, onValueChange) => {
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
        onValueChange(event.target.checked);
    };

    return (
            <input class={"peer relative appearance-none w-6 h-6 mr-4 border rounded-lg border-gray-300 cursor-pointer checked:bg-blue-500 " + classNames}
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
            />
    );
};

export default Checkbox;