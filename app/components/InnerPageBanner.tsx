import React from 'react';
import Image from 'next/image';

interface InnerPageBannerProps {
    heading: string;
    text: string;
    backgroundImage: any; // For locally imported images, we use StaticImageData type
}

const InnerPageBanner: React.FC<InnerPageBannerProps> = ({ heading, text, backgroundImage }) => {
    return (
        <div className="relative w-full h-36 md:h-52 lg:h-96">
            {/* Background Image */}
            <Image
                src={backgroundImage}
                alt="Banner Background"
                layout="fill"  // Fill the container
                objectFit="cover"  // Cover the entire container
                className="absolute z-0"
            />
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black/80">
                <h1 className="text-2xl md:text-4xl font-bold font-serif shadow-lg shadow-red-900 ">{heading}</h1>
                <p className="text-xl md:text-2xl mt-2 md:mt-4">{text}</p>
            </div>
        </div>
    );
};

export default InnerPageBanner;
