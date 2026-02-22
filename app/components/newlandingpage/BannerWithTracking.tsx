"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { IoSearch, IoCubeOutline } from "react-icons/io5";
import TrackingModal from '../modals/TrackingModal';

// --- CINEMATIC ENTRANCE VARIANTS ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 15 } }
};

const trackingBoxVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: "50%", transition: { type: "spring", stiffness: 100, damping: 20, delay: 0.6 } }
};

const BannerWithTracking = () => {
    const [inputTracking, setInputTracking] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTrackClick = () => {
        if (!inputTracking.trim()) return; // Prevent empty searches
        setIsModalOpen(true);
    };

    return (
        // Added margin-bottom to accommodate the overlapping tracking box
        <div className="relative mb-32 md:mb-24">
            
            {/* Banner Component */}
            <div className='w-full relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden rounded-b-[2.5rem] shadow-xl'>
                
                {/* Background Animation - Optimized for Next.js */}
                <Image
                    src="/videos/bulq_anime.gif"
                    alt="Background Animation"
                    fill
                    priority
                    unoptimized
                    className="z-0 object-cover scale-105"
                />

                {/* Premium Glassmorphism Overlay */}
                <div className='absolute inset-0 bg-appTitleBgColor/85 z-[1] backdrop-blur-[2px]'>
                    <motion.div 
                        animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 left-1/4 w-full h-full bg-gradient-to-br from-appNav/20 to-transparent mix-blend-overlay pointer-events-none"
                    />
                </div>

                {/* Content Container */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className='relative z-10 text-center text-white px-4 max-w-4xl -mt-10 md:-mt-20'
                >
                    <motion.h1 variants={itemVariants} className='font-extrabold text-5xl md:text-7xl mb-6 tracking-tight leading-tight drop-shadow-xl'>
                        Move Anything, <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-appNav to-blue-200">
                            Anywhere in your city
                        </span>
                    </motion.h1>
                    
                    <motion.p variants={itemVariants} className="font-medium text-lg md:text-2xl mb-10 text-blue-50/80 drop-shadow-md">
                        No delay, No stress, just delivery.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex gap-4 justify-center">
                        <button className="group relative px-8 py-4 bg-appNav rounded-xl text-white font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all duration-300 transform active:scale-95 overflow-hidden flex items-center gap-2">
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            <span className="relative z-10 flex items-center gap-2">
                                <IoCubeOutline className="text-2xl" /> Book Shipment
                            </span>
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Tracking Search Overlay (4D Upgraded) */}
            <motion.div 
                variants={trackingBoxVariants}
                initial="hidden"
                animate="show"
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[95%] max-w-5xl z-20"
            >
                <div className="relative rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] overflow-hidden group">
                    
                    {/* Background image container */}
                    <div className="absolute inset-0 z-0">
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 transition-transform duration-1000 group-hover:scale-105"
                            style={{ backgroundImage: "url('/images/tracksearchbg.png')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90 backdrop-blur-sm"></div>
                    </div>

                    {/* Content container */}
                    <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        
                        <div className="text-center md:text-left md:w-5/12">
                            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Track Package</h2>
                            <p className="text-sm md:text-base text-gray-300 font-medium">
                                Enter your BulQ Tracking Number to get real-time updates on your shipment.
                            </p>
                        </div>

                        <div className="w-full md:w-7/12 relative">
                            <div className="relative flex shadow-inner rounded-full bg-white/10 p-1 border border-white/20 backdrop-blur-md transition-all focus-within:bg-white/20 focus-within:border-white/40">
                                <IoSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-2xl z-10" />
                                <input
                                    type="text"
                                    value={inputTracking}
                                    onChange={(e) => setInputTracking(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleTrackClick()}
                                    placeholder="e.g. BQ123456789"
                                    className="flex-grow py-4 pl-14 pr-6 bg-transparent text-lg text-white placeholder-gray-400 outline-none font-medium uppercase tracking-wider"
                                />
                                <button
                                    onClick={handleTrackClick}
                                    disabled={!inputTracking.trim()}
                                    className="bg-appNav hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 whitespace-nowrap shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Track
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </motion.div>

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