"use client"; // Required for hooks

import React, { useState } from 'react';
import TrackingModal from '../modals/TrackingModal';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import LandingBanner from '../landingbanner/LandingBanner';
import HomeHeader from './HomeHeader';

// --- ENTRANCE ANIMATION VARIANTS ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15 } }
};

const BannerWithTracking = () => {
    const [inputTracking, setInputTracking] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTrackClick = () => {
        setIsModalOpen(true);
    };

    return (
        // Increased mobile bottom margin to prevent the stacked tracking box from overlapping content below
        <div className="relative mb-40 md:mb-48">
            
            {/* Banner Component */}
            <div className='w-full relative min-h-[750px] lg:min-h-[850px] py-20 md:py-24 flex items-center justify-center'>
                
                <Image
                    className='absolute z-0 object-cover'
                    src="/videos/bulq_anime.gif"
                    alt="Background Animation"
                    fill
                    unoptimized
                />

                {/* Overlay to make text more readable */}
                <div className='absolute inset-0 bg-appTitleBgColor bg-opacity-90 z-[1] backdrop-blur-[2px]'></div>

                {/* --- HEADER PLACEMENT --- */}
                <div className="absolute top-0 left-0 w-full z-50">
                    <HomeHeader />
                </div>

               {/* Content Container */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    // Responsive margin-top to keep it balanced on all devices
                    className='relative z-[60] text-center text-white px-4 w-full max-w-7xl mx-auto flex flex-col items-center justify-center mt-16 md:mt-28'
                >
                    {/* Fluid Typography: 4xl on mobile, 5xl on tablet, 6xl on desktop */}
                    <motion.h2 variants={itemVariants} className='font-bold text-4xl sm:text-5xl md:text-6xl mb-4 tracking-tight drop-shadow-md'>
                        Move Anything, Anywhere in your city
                    </motion.h2>
                    
                    <motion.p variants={itemVariants} className="font-semibold text-lg sm:text-xl md:text-2xl mb-10 md:mb-12 text-blue-50/90 drop-shadow">
                        <span className='block'>No delay, No stress, just delivery.</span>
                    </motion.p>
                    
                    <motion.div variants={itemVariants} className="flex justify-center w-full">
                        <LandingBanner />
                    </motion.div>
                </motion.div>
            </div>

            {/* Tracking Search Overlay - OUTER DIV IS UNTOUCHED */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-6xl px-4 z-20">
                
                {/* MOTION WRAPPER */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
                    className="relative"
                >
                    {/* Premium Glassmorphism Background container */}
                    <div className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)]">
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
                            style={{ backgroundImage: "url('/images/tracksearchbg.png')" }}
                        ></div>
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                    </div>

                    {/* Content container - Responsive padding */}
                    <div className="relative rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10">
                        <div className="text-center mb-6 md:mb-8">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 md:mb-3 tracking-tight">Track Your Package</h1>
                            <p className="text-base md:text-lg text-gray-200 font-medium">
                                Enter Your Bulq Tracking Number to see the status of your shipment
                            </p>
                        </div>

                        {/* RESPONSIVE FIX: flex-col on mobile, flex-row on larger screens */}
                        <div className="relative flex flex-col sm:flex-row gap-3 sm:gap-0 max-w-4xl mx-auto">
                            <input
                                type="text"
                                value={inputTracking}
                                onChange={(e) => setInputTracking(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleTrackClick()}
                                placeholder="Tracking number (e.g. BQ123456789)"
                                // Separate border radii for mobile vs desktop
                                className="flex-grow py-4 px-6 rounded-xl sm:rounded-r-none sm:rounded-l-full text-base sm:text-lg border border-gray-300 focus:ring-2 focus:ring-appNav focus:border-blue-500 focus:outline-none bg-white/95 text-gray-900 shadow-inner w-full"
                            />
                            <button
                                onClick={handleTrackClick}
                                // Full width on mobile, auto width on desktop
                                className="bg-appNav hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl sm:rounded-l-none sm:rounded-r-full transition duration-300 whitespace-nowrap shadow-lg w-full sm:w-auto text-lg active:scale-[0.98]"
                            >
                                Track Package
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Tracking Modal Integration */}
            <TrackingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialTrackingNumber={inputTracking}
            />
        </div>
    );
};

export default BannerWithTracking;

// "use client"; // Required for hooks

// import React, { useState } from 'react';
// import TrackingModal from '../modals/TrackingModal';
// import Image from 'next/image';

// const BannerWithTracking = () => {
//     // State for the input field in the banner
//     const [inputTracking, setInputTracking] = useState('');
//     // State to toggle the modal
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // Handle the search action
//     const handleTrackClick = () => {
//         setIsModalOpen(true);
//         // The modal will read 'inputTracking' via the 'initialTrackingNumber' prop 
//         // and trigger the search automatically.
//     };

//     return (
//         <div className="relative">
//             {/* Banner Component */}
//             <div className='w-full relative h-[584px] flex items-center justify-center'>
//                 {/* <video
//                     className='absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover'
//                     autoPlay
//                     loop
//                     muted
//                     playsInline
//                     preload="auto"
//                 >
//                     <source src="/videos/bulq_anime.gif" type="video/mp4" />
//                     Your browser does not support the video tag.
//                 </video> */}
//                 <Image
//                     className='absolute z-0 w-full h-full object-cover'
//                     src="/videos/bulq_anime.gif"
//                     alt="Background Animation"
//                 />

//                 {/* Overlay to make text more readable */}
//                 <div className='absolute inset-0 bg-appTitleBgColor bg-opacity-90 z-1'></div>

//                 {/* Content Container */}
//                 <div className='relative z-10 text-center text-white px-4'>
//                     <h2 className='font-bold text-5xl mb-6'>Shop Globally, Ship Smartly</h2>
//                     <p className="font-semibold text-xl mb-8">
//                         <span className='block'>Your centralized logistics solution for international shopping.</span>
//                         <span className='block'>We consolidate and deliver your purchases worldwide</span>
//                     </p>
//                     <div className="flex gap-4 justify-center">
//                         <button className="px-8 py-3 bg-appNav rounded-md text-white hover:bg-opacity-90 transition hover:bg-appTitleBgColor hover:border-appNav hover:border-2 border-2 border-transparent">
//                             Get Started
//                         </button>
//                         <button className="px-8 py-3 bg-transparent rounded-md text-white hover:bg-white hover:bg-opacity-10 transition">
//                             <span className="border-b-2 border-white">Learn More</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Tracking Search Overlay */}
//             <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-6xl px-4 z-20">
//                 {/* Background image container */}
//                 <div className="absolute inset-0 rounded-xl overflow-hidden">
//                     <div
//                         className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
//                         style={{ backgroundImage: "url('/images/tracksearchbg.png')" }}
//                     ></div>
//                     <div className="absolute inset-0 bg-black bg-opacity-40"></div>
//                 </div>

//                 {/* Content container */}
//                 <div className="relative rounded-xl shadow-2xl p-8">
//                     <div className="text-center mb-6">
//                         <h1 className="text-4xl font-bold text-white mb-2">Track Your Package</h1>
//                         <p className="text-lg text-white">
//                             Enter Your Bulq Tracking Number to see the status of your shipment
//                         </p>
//                     </div>

//                     <div className="relative flex">
//                         <input
//                             type="text"
//                             value={inputTracking}
//                             onChange={(e) => setInputTracking(e.target.value)}
//                             onKeyDown={(e) => e.key === 'Enter' && handleTrackClick()}
//                             placeholder="Enter tracking number (e.g. BQ123456789)"
//                             className="flex-grow py-4 px-6 rounded-l-full text-lg border border-gray-300 focus:ring-2 focus:ring-appNav focus:border-blue-500 focus:outline-none bg-white bg-opacity-90 text-gray-900"
//                         />
//                         <button
//                             onClick={handleTrackClick}
//                             className="bg-appNav hover:bg-appTitleBgColor text-white font-bold py-4 px-8 rounded-r-full transition duration-200 whitespace-nowrap"
//                         >
//                             Track Package
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Tracking Modal Integration */}
//             <TrackingModal
//                 isOpen={isModalOpen}
//                 onClose={() => setIsModalOpen(false)}
//                 initialTrackingNumber={inputTracking}
//             />
//         </div>
//     );
// };

// export default BannerWithTracking;