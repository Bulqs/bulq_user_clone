import React from 'react'
import { IoIosArrowForward } from "react-icons/io";
import Image from 'next/image';

interface LandingBannerCardProps {
    title: string;
    description: string;
    imageSrc?: string; // New optional prop for the image
    onClick?: (title: string, description: string) => void;
}

const LandingBannerCard: React.FC<LandingBannerCardProps> = ({ title, description, imageSrc, onClick }) => {

    const handleClick = () => {
        if (onClick) {
            onClick(title, description);
        }
    };

    return (
        <div 
            onClick={handleClick}
            className="group cursor-pointer bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-2xl hover:shadow-appBanner/20 transform transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between h-full min-h-[220px] overflow-hidden relative"
        >
            {/* Top Bar Indicator */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 group-hover:bg-appBanner transition-colors duration-500"></div>

            {/* Main Content Area: Flex Row for Text + Image */}
            <div className="flex flex-row items-center justify-between gap-4 mt-2">
                
                {/* Text Section */}
                <div className="flex-1 z-10">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 group-hover:text-appBanner transition-colors leading-tight">
                        {title}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">
                        {description}
                    </p>
                </div>

                {/* Image Section */}
                {imageSrc && (
                    <div className="w-40 h-40 relative flex-shrink-0">
                        <Image 
                            src={imageSrc} 
                            alt={title} 
                            fill 
                            className="object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                )}
            </div>
            
            {/* Arrow Button at Bottom Right */}
            <div className="mt-4 flex justify-end">
                <span className="p-2 rounded-full bg-gray-50 text-gray-400 border border-gray-100 group-hover:bg-appBanner group-hover:text-white group-hover:border-appBanner transition-all duration-300">
                    <IoIosArrowForward size={20} />
                </span>
            </div>
        </div>
    )
}

export default LandingBannerCard;
