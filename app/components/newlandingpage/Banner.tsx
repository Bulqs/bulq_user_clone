import React from 'react'
import Image from 'next/image';

const Banner = () => {
    return (
        <div className='w-full relative h-[584px] flex items-center justify-center overflow-hidden'>
            {/* <video
                className='absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover'
                controls preload="auto">
                <source src="/videos/bulq_anime.gif" type="video/mp4" />
                <track
                    src="/videos/bulq_anime.gif"
                    // kind="subtitles"
                    // srcLang="en"
                    // label="English"
                />
                Your browser does not support the video tag.
            </video> */}
            <Image
                    className='absolute z-0 w-full h-full object-cover'
                    src="/videos/bulq_anime.gif"
                    alt="Background Animation"
                />
            
            {/* Overlay to make text more readable */}
            <div className='absolute inset-0 bg-appTitleBgColor bg-opacity-25 z-1'></div>

            {/* Content Container */}
            <div className='relative z-10 text-center text-white px-4'>
                <h2 className='font-bold text-5xl mb-6'>Shop Globally, Ship Smartly</h2>
                <p className="font-semibold text-xl mb-8">
                    <span className='block'>Your centralized logistics solution for international shopping.</span>
                    <span className='block'>We consolidate and deliver your purchases worldwide</span>
                </p>
                <div className="flex gap-4 justify-center">
                    <button className="px-8 py-3 bg-appNav rounded-md text-white hover:bg-opacity-90 transition">
                        Get Started
                    </button>
                    <button className="px-8 py-3 bg-transparent rounded-md text-white hover:bg-white hover:bg-opacity-10 transition">
                        <span className="border-b-2 border-white">Learn More</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Banner;