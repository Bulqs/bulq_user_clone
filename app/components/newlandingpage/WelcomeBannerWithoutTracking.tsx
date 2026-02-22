"use client";
import React from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { IoRocketOutline } from "react-icons/io5";

interface WelcomeBannerProps {
    onGetStartedClick?: () => void;
}

// --- CINEMATIC ENTRANCE VARIANTS ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, // Delay between each element appearing
            delayChildren: 0.1,   // Initial delay before the sequence starts
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { type: "spring", stiffness: 120, damping: 15 } 
    }
};

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onGetStartedClick }) => {
    return (
        <div className="relative w-full h-[650px] md:h-[700px] flex items-center justify-center overflow-hidden">
            
            {/* Background Animation - Fixed with 'fill' and 'unoptimized' */}
            <Image
                src="/videos/bulq_anime.gif"
                alt="Background Animation"
                fill
                priority
                unoptimized
                className="z-0 object-cover scale-105" // slight scale to hide any edge clipping
            />

            {/* Premium Glassmorphism Overlay */}
            <div className='absolute inset-0 bg-appTitleBgColor/80 z-[1] backdrop-blur-sm'>
                {/* Subtle animated gradient mesh inside the overlay to make it feel alive */}
                <motion.div 
                    animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-0 left-1/4 w-full h-full bg-gradient-to-br from-appNav/20 to-transparent mix-blend-overlay pointer-events-none"
                />
            </div>

            {/* Content Container - Linked to Framer Motion Variants */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className='relative z-10 text-center text-white px-4 max-w-4xl mt-10'
            >
                {/* Hero Title */}
                <motion.h1 variants={itemVariants} className='font-extrabold text-5xl md:text-7xl mb-6 tracking-tight leading-tight drop-shadow-xl'>
                    Shop Globally, <br className="md:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-appNav to-blue-200">
                        Ship Smartly
                    </span>
                </motion.h1>
                
                {/* Subtitle */}
                <motion.p variants={itemVariants} className="font-medium text-lg md:text-2xl mb-12 text-blue-50/80 drop-shadow-md max-w-3xl mx-auto">
                    Your centralized logistics solution for international shopping. 
                    We consolidate and deliver your purchases worldwide with ease and speed.
                </motion.p>

                {/* Call to Action Buttons */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                    
                    {/* Primary Shimmering Button */}
                    <motion.button 
                        onClick={onGetStartedClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ y: [0, -5, 0] }} // Gentle continuous floating
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="group relative w-full sm:w-auto px-10 py-4 bg-appNav rounded-full text-white font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] border border-blue-400/30 overflow-hidden"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Get Started Now <IoRocketOutline className="text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </span>
                    </motion.button>
                    
                    {/* Secondary Ghost Button */}
                    <motion.button 
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-white/50 rounded-full text-white font-bold text-lg backdrop-blur-md transition-colors"
                    >
                        Learn How It Works
                    </motion.button>
                </motion.div>

                {/* Social Proof / Trust Badges */}
                <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-white/20 flex flex-wrap justify-center gap-10 md:gap-16">
                    <div className="flex flex-col items-center group cursor-default">
                        <span className="font-extrabold text-3xl md:text-4xl text-white group-hover:text-appNav transition-colors duration-300">50k+</span>
                        <span className="text-sm font-medium text-gray-300 tracking-wider uppercase mt-1">Active Users</span>
                    </div>
                    <div className="flex flex-col items-center group cursor-default">
                        <span className="font-extrabold text-3xl md:text-4xl text-white group-hover:text-appNav transition-colors duration-300">120+</span>
                        <span className="text-sm font-medium text-gray-300 tracking-wider uppercase mt-1">Countries Served</span>
                    </div>
                    <div className="flex flex-col items-center group cursor-default">
                        <span className="font-extrabold text-3xl md:text-4xl text-white group-hover:text-appNav transition-colors duration-300">99.9%</span>
                        <span className="text-sm font-medium text-gray-300 tracking-wider uppercase mt-1">Delivery Rate</span>
                    </div>
                </motion.div>
            </motion.div>

        </div>
    );
};

export default WelcomeBanner;

// "use client";

// import React from 'react';
// import Image from 'next/image';

// interface WelcomeBannerProps {
//     onGetStartedClick?: () => void;
// }

// const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onGetStartedClick }) => {
//     return (
//         <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
//             {/* Background Animation - Fixed with 'fill' and 'unoptimized' */}
//             <Image
//                 src="/videos/bulq_anime.gif"
//                 alt="Background Animation"
//                 fill
//                 priority
//                 unoptimized
//                 className="z-0 object-cover"
//             />

//             {/* Overlay to make text readable */}
//             <div className='absolute inset-0 bg-appTitleBgColor bg-opacity-80 z-[1] backdrop-blur-[2px]'></div>

//             {/* Content Container */}
//             <div className='relative z-10 text-center text-white px-4 max-w-4xl'>
//                 <h1 className='font-extrabold text-4xl md:text-6xl mb-6 tracking-tight leading-tight'>
//                     Shop Globally, <span className="text-appNav">Ship Smartly</span>
//                 </h1>
                
//                 <p className="font-medium text-lg md:text-2xl mb-10 text-gray-200">
//                     Your centralized logistics solution for international shopping. 
//                     We consolidate and deliver your purchases worldwide with ease and speed.
//                 </p>

//                 <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                     <button 
//                         onClick={onGetStartedClick}
//                         className="w-full sm:w-auto px-10 py-4 bg-appNav rounded-full text-white font-bold text-lg hover:bg-white hover:text-appNav transition-all duration-300 shadow-lg border-2 border-appNav"
//                     >
//                         Get Started Now
//                     </button>
                    
//                     <button className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-white rounded-full text-white font-bold text-lg hover:bg-white hover:text-appTitleBgColor transition-all duration-300">
//                         Learn How It Works
//                     </button>
//                 </div>

//                 {/* Optional Social Proof / Trust Badges */}
//                 <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-8 opacity-60">
//                     <div className="flex items-center gap-2">
//                         <span className="font-bold">50k+</span>
//                         <span className="text-sm">Active Users</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <span className="font-bold">120+</span>
//                         <span className="text-sm">Countries Served</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default WelcomeBanner;