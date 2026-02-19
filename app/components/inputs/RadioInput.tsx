import React from 'react';

interface RadioInputProps {
    defaultChecked?: boolean;
    name: string;
    ariaLabel: string;
    className?: string;
}

const RadioInput: React.FC<RadioInputProps> = ({
    defaultChecked = false,
    name,
    ariaLabel,
    className = ''
}) => {
    return (
        <input
            defaultChecked={defaultChecked}
            type="radio"
            name={name}
            aria-label={ariaLabel}
            className={`appearance-none rounded-full w-4 h-4 border border-gray-400 checked:bg-appTitleBgColor checked:border-transparent focus:outline-none cursor-pointer ${className}`}
        />
    );
};

export default RadioInput;
