"use client";
import React, { MouseEvent } from 'react';
import { IoArrowForward } from "react-icons/io5";
import { motion, useMotionTemplate, useMotionValue, Variants } from 'framer-motion';

interface SignUpProps {
    onRegisterClick?: () => void;
}

// --- ORCHESTRATED ANIMATION VARIANTS ---
const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    show: {
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
};

const SignUpWithBulq: React.FC<SignUpProps> = ({ onRegisterClick }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
            
            <style jsx>{`
                .pop-out { transform: translateZ(0px); transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
                .card-3d:hover .pop-out { transform: translateZ(40px); }
                .card-3d:hover .pop-out-button { transform: translateZ(60px) scale(1.05); }
            `}</style>

            <div className="max-w-7xl mx-auto" style={{ perspective: "1200px" }}>
                
                {/* Main 4D Card Container */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    onMouseMove={handleMouseMove}
                    whileHover={{ rotateX: 2, rotateY: -2 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="card-3d group relative rounded-[2.5rem] overflow-hidden bg-appNav shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-shadow duration-700"
                >
                    
                    {/* 4D SPOTLIGHT (Bright white/blue glow for dark background) */}
                    <motion.div
                        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-10"
                        style={{
                            background: useMotionTemplate`
                                radial-gradient(
                                    600px circle at ${mouseX}px ${mouseY}px,
                                    rgba(255, 255, 255, 0.15), 
                                    transparent 80%
                                )
                            `,
                        }}
                    />

                    {/* Animated Background Mesh */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.2, 1], 
                                rotate: [0, 90, 0],
                                opacity: [0.2, 0.3, 0.2] 
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-500 blur-[100px] mix-blend-screen"
                        />
                        <motion.div 
                            animate={{ 
                                scale: [1, 1.5, 1], 
                                rotate: [0, -90, 0],
                                opacity: [0.1, 0.2, 0.1] 
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-purple-500 blur-[120px] mix-blend-screen"
                        />
                        {/* A subtle grid overlay to give it a "tech/logistics" feel */}
                        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10 mix-blend-overlay"></div>
                    </div>

                    {/* Content Container */}
                    <div className="relative z-20 px-8 py-20 md:py-24 md:px-16 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
                        
                        {/* Text Content */}
                        <div className="max-w-2xl pop-out">
                            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-lg">
                                Ready to start <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 animate-gradient-x">
                                    shopping globally?
                                </span>
                            </motion.h2>
                            <motion.p variants={itemVariants} className="text-lg md:text-xl text-blue-100 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 drop-shadow-md">
                                Create your free account today and get instant access to your own international shipping address. Join the BulQ network now.
                            </motion.p>
                        </div>

                        {/* Buttons */}
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto pop-out-button transition-all duration-500">
                            
                            {/* Primary Register Button */}
                            <button 
                                onClick={onRegisterClick}
                                className="group/btn relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-appNav bg-white rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all duration-300 transform active:scale-95 overflow-hidden"
                            >
                                {/* Button Hover Shine Effect */}
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                                
                                <span className="relative z-10 flex items-center">
                                    Get Started Free
                                    <IoArrowForward className="ml-3 text-2xl group-hover/btn:translate-x-2 transition-transform duration-300" />
                                </span>
                            </button>
                            
                            {/* Secondary Button */}
                            <button className="inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-white border-2 border-white/20 rounded-2xl hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-md active:scale-95">
                                Learn More
                            </button>

                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default SignUpWithBulq;

// import React from 'react';
// import { IoArrowForward } from "react-icons/io5";

// const SignUpWithBulq = () => {
//     return (
//         <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">
                
//                 {/* Main Card Container */}
//                 <div className="relative rounded-3xl overflow-hidden bg-appNav shadow-2xl">
                    
//                     {/* Background Decorative Blobs (Glow Effects) */}
//                     <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
//                         <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 opacity-20 blur-3xl mix-blend-screen"></div>
//                         <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-500 opacity-20 blur-3xl mix-blend-screen"></div>
//                     </div>

//                     <div className="relative z-10 px-6 py-16 md:py-20 md:px-12 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
                        
//                         {/* Text Content */}
//                         <div className="max-w-2xl">
//                             <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
//                                 Ready to start <br className="hidden md:block" />
//                                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
//                                     shopping globally?
//                                 </span>
//                             </h2>
//                             <p className="text-lg md:text-xl text-blue-100 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
//                                 Create your free account today and get instant access to your own international shipping address.
//                             </p>
//                         </div>

//                         {/* Buttons */}
//                         <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//                             <button className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-appNav bg-white rounded-xl shadow-lg hover:bg-gray-50 hover:shadow-white/20 transition-all duration-300 transform hover:-translate-y-1">
//                                 Get Started
//                                 <IoArrowForward className="ml-2 text-xl group-hover:translate-x-1 transition-transform" />
//                             </button>
                            
//                             <button className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border-2 border-white/20 rounded-xl hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
//                                 Learn More
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//         </section>
//     );
// };

// export default SignUpWithBulq;