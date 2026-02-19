import React from 'react';
import { IoArrowForward } from "react-icons/io5";

interface LandingBannerCard2Props {
    title: string;
    description: string;
    onClick?: (title: string, description: string) => void;
}

const LandingBannerCard2: React.FC<LandingBannerCard2Props> = ({ title, description, onClick }) => {

    const handleClick = () => {
        if (onClick) {
            onClick(title, description);
        }
    };

    return (
        <div 
            onClick={handleClick}
            // UPDATED: 
            // 1. Default bg is 'bg-gray-50' (subtle contrast against white/gray modal).
            // 2. Default border is 'border-gray-200' (visible structure).
            // 3. Hover brings it to 'bg-white', adds a shadow, and changes border color.
            className="group relative cursor-pointer bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:bg-white hover:border-appBanner/30 transform transition-all duration-300 flex flex-col justify-between min-h-[180px]"
        >
            {/* Hover Indicator Line (Top accent) */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-200 group-hover:bg-appBanner rounded-t-2xl transition-colors duration-300"></div>

            <div className="flex flex-col items-center text-center mt-4">
                <h2 className="text-lg font-extrabold text-gray-800 mb-3 group-hover:text-black transition-colors leading-tight">
                    {title}
                </h2>
                <p className="text-xs text-gray-500 font-medium leading-relaxed px-2 group-hover:text-gray-600">
                    {description}
                </p>
            </div>

            {/* Circle Arrow Icon: Gray by default, Colored on hover */}
            <div className="mt-4 flex justify-center">
                <span className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-300 flex items-center justify-center shadow-sm group-hover:border-appBanner/20 group-hover:text-appBanner group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                    <IoArrowForward size={18} />
                </span>
            </div>
        </div>
    )
}

export default LandingBannerCard2;