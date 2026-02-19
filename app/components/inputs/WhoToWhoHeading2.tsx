import React from 'react'

interface WhoToWhoHeading2Props {
    text: string;
    bgColor?: string;
    textColor?: string;
    additionalClasses?: string;
}

const WhoToWhoHeading2: React.FC<WhoToWhoHeading2Props> = ({
    text,
    bgColor = 'bg-appWhite', // default background color
    textColor = 'text-appBlack', // default text color
    additionalClasses = ' ',
}) => {
    return (
        <div className={`flex items-center md:justify-between w-full ${bgColor} py-0 px-0 mb-2 ${additionalClasses}`}>
            <p className={`text-sm md:text-xl ${textColor} font-semibold leading-tight text-center`}>
                {text}
            </p>
        </div>
    );
};

export default WhoToWhoHeading2
