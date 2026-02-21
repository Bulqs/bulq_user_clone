"use client";
import React, { MouseEvent } from 'react';
import Image from 'next/image';
import { motion, useMotionTemplate, useMotionValue, Variants } from 'framer-motion';

const steps = [
    {
        id: 1,
        title: 'Shop Anywhere',
        description: 'Purchase from any global e-commerce store using your BulQ warehouse address.',
        image: '/images/search.png', 
    },
    {
        id: 2,
        title: 'We Receive',
        description: 'Your items arrive at our secure warehouse where we inspect and store them safely.',
        image: '/images/home.png',
    },
    {
        id: 3,
        title: 'We Consolidate',
        description: 'We professionally repack and consolidate multiple purchases into single efficient shipments.',
        image: '/images/package.png',
    },
    {
        id: 4,
        title: 'We Deliver',
        description: 'Your consolidated package is shipped quickly and directly to your doorstep.',
        image: '/images/van.png',
    }
];

// --- ORCHESTRATED ANIMATION VARIANTS ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, 
            delayChildren: 0.1,
        }
    }
};

const cardVariants: Variants = {
    hidden: { 
        opacity: 0, 
        scale: 0.5,
        y: 80,
        rotateX: -30
    },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        transition: {
            type: "spring",
            stiffness: 150,
            damping: 15,
            mass: 1.2
        }
    }
};

// --- 4D STEP CARD COMPONENT ---
const StepCard = ({ step, index }: { step: any, index: number }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div variants={cardVariants} className="relative z-10 h-full">
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ 
                    duration: 5, 
                    repeat: Infinity, 
                    ease: "easeInOut", 
                    delay: index * 0.8 
                }}
                className="h-full"
            >
                <motion.div
                    onMouseMove={handleMouseMove}
                    whileHover={{ scale: 1.03, rotateX: 6, rotateY: -6 }}
                    style={{ transformStyle: "preserve-3d" }}
                    // Added min-h-[400px], flex flex-col, and adjusted padding to stretch the card smoothly
                    className="group relative bg-white/90 backdrop-blur-md rounded-3xl p-8 pt-10 pb-10 border border-gray-100 shadow-xl hover:shadow-2xl h-full min-h-[420px] flex flex-col items-center justify-start cursor-pointer transition-shadow duration-500"
                >
                    {/* 4D LIGHT SPOTLIGHT */}
                    <motion.div
                        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                        style={{
                            background: useMotionTemplate`
                                radial-gradient(
                                    500px circle at ${mouseX}px ${mouseY}px,
                                    rgba(59, 130, 246, 0.08), 
                                    transparent 80%
                                )
                            `,
                        }}
                    />

                    {/* Step Number Badge */}
                    <div className="absolute top-6 right-6 pop-out z-20">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-400 font-black text-lg group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg transition-all duration-500">
                            {step.id}
                        </span>
                    </div>

                    {/* Icon / Image Area (Added more bottom margin for length) */}
                    <div className="flex justify-center mb-10 mt-6 pop-out z-20 w-full">
                        <div className="relative w-28 h-28 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl flex items-center justify-center p-6 group-hover:shadow-2xl shadow-blue-500/20 transition-all duration-500 overflow-visible">
                            <div className="absolute inset-0 bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                            
                            <Image
                                src={step.image}
                                alt={step.title}
                                width={100} 
                                height={100}
                                className="object-contain relative z-20 drop-shadow-sm group-hover:drop-shadow-2xl transition-all duration-500"
                            />
                        </div>
                    </div>

                    {/* Content Area (Pushes slightly lower for balance) */}
                    <div className="text-center relative z-20 pop-out-slight flex-grow flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                            {step.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            {step.description}
                        </p>
                    </div>

                    {/* Connector Line (Desktop Only) */}
                    {step.id !== 4 && (
                        <div className="hidden lg:block absolute top-1/2 -right-5 w-10 h-[2px] bg-gradient-to-r from-gray-200 to-transparent transform -translate-y-1/2 z-0 opacity-50 pointer-events-none"></div>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

// --- MAIN SECTION COMPONENT ---
const HowItWorks = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8 overflow-hidden relative">
            
            <style jsx>{`
                .pop-out { transform: translateZ(0px); transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
                .pop-out-slight { transform: translateZ(0px); transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
                .group:hover .pop-out { transform: translateZ(80px) scale(1.1); }
                .group:hover .pop-out-slight { transform: translateZ(30px); }
            `}</style>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-40 z-0">
                <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-40 left-10 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px]"
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em]">Process</h2>
                    <p className="mt-3 text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
                        How BulQ Works
                    </p>
                    <p className="mt-5 text-xl text-gray-500 font-medium">
                        Get your international purchases delivered in 4 simple steps.
                    </p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10 relative" 
                    style={{ perspective: "1200px" }}
                >
                    {steps.map((step, index) => (
                        <StepCard key={step.id} step={step} index={index} />
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default HowItWorks;

// "use client";
// import React from 'react';
// import Image from 'next/image';

// const HowItWorks = () => {
//     const steps = [
//         {
//             id: 1,
//             title: 'Shop Anywhere',
//             description: 'Purchase from any global e-commerce store using your BulQ warehouse address.',
//             image: '/images/search.png', 
//         },
//         {
//             id: 2,
//             title: 'We Receive',
//             description: 'Your items arrive at our secure warehouse where we inspect and store them safely.',
//             image: '/images/home.png',
//         },
//         {
//             id: 3,
//             title: 'We Consolidate',
//             description: 'We professionally repack and consolidate multiple purchases into single efficient shipments.',
//             image: '/images/package.png',
//         },
//         {
//             id: 4,
//             title: 'We Deliver',
//             description: 'Your consolidated package is shipped quickly and directly to your doorstep.',
//             image: '/images/van.png',
//         }
//     ];

//     return (
//         <section className="py-24 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8 overflow-hidden">
//             {/* Custom CSS for 3D Video Effects */}
//             <style jsx>{`
//                 .perspective-grid {
//                     perspective: 1200px;
//                 }
//                 .card-3d {
//                     transform-style: preserve-3d;
//                     transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease;
//                 }
//                 .card-3d:hover {
//                     /* Tilts the card back slightly and lifts it */
//                     transform: rotateX(8deg) rotateY(-8deg) translateY(-12px) scale(1.02);
//                     box-shadow: 25px 35px 60px -15px rgba(0, 0, 0, 0.15);
//                 }
//                 .pop-out {
//                     transform: translateZ(0px);
//                     transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
//                 }
//                 .card-3d:hover .pop-out {
//                     /* Forces the image and badge to literally pop off the card in 3D space */
//                     transform: translateZ(70px) scale(1.15);
//                 }
//                 @keyframes float-smooth {
//                     0%, 100% { transform: translateY(0px); }
//                     50% { transform: translateY(-8px); }
//                 }
//                 .animate-float {
//                     animation: float-smooth 6s ease-in-out infinite;
//                 }
//                 /* Stagger animations so they don't bounce at the exact same time */
//                 .delay-1 { animation-delay: 0s; }
//                 .delay-2 { animation-delay: 1.5s; }
//                 .delay-3 { animation-delay: 3s; }
//                 .delay-4 { animation-delay: 4.5s; }
//             `}</style>

//             <div className="max-w-7xl mx-auto">
//                 <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
//                     <h2 className="text-sm font-bold text-appBanner uppercase tracking-[0.2em]">Process</h2>
//                     <p className="mt-3 text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
//                         How BulQ Works
//                     </p>
//                     <p className="mt-5 text-xl text-gray-500 font-medium">
//                         Get your international purchases delivered in 4 simple steps.
//                     </p>
//                 </div>

//                 {/* Applying the perspective to the grid wrapper */}
//                 <div className="perspective-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10 relative">
                    
//                     {/* Background decorative glow */}
//                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-appBanner/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

//                     {steps.map((step, index) => (
//                         <div
//                             key={step.id}
//                             className={`animate-float delay-${index + 1} relative z-10`}
//                         >
//                             <div className="card-3d group relative bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-gray-100 shadow-lg h-full">
                                
//                                 {/* Inner Card Glossy Overlay (Shows on Hover) */}
//                                 <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/0 via-white/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

//                                 {/* Step Number Badge (Pops out in 3D) */}
//                                 <div className="absolute top-6 right-6 pop-out">
//                                     <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-400 font-black text-lg group-hover:bg-appBanner group-hover:text-white group-hover:shadow-xl transition-all duration-500">
//                                         {step.id}
//                                     </span>
//                                 </div>

//                                 {/* Icon / Image Area (Pops out massively in 3D) */}
//                                 <div className="flex justify-center mb-8 mt-4 pop-out">
//                                     <div className="relative w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl flex items-center justify-center p-5 group-hover:shadow-2xl shadow-blue-500/20 transition-all duration-500">
//                                         {/* Glowing shadow behind the image on hover */}
//                                         <div className="absolute inset-0 bg-appBanner/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                                        
//                                         <Image
//                                             src={step.image}
//                                             alt={step.title}
//                                             width={90} 
//                                             height={90}
//                                             className="object-contain relative z-10 drop-shadow-md group-hover:drop-shadow-2xl transition-all duration-500"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Content Area */}
//                                 <div className="text-center relative z-10 transform-gpu transition-transform duration-500 group-hover:translate-z-4">
//                                     <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-appBanner transition-colors duration-300">
//                                         {step.title}
//                                     </h3>
//                                     <p className="text-sm text-gray-500 leading-relaxed font-medium">
//                                         {step.description}
//                                     </p>
//                                 </div>

//                                 {/* Connector Line (Desktop Only) */}
//                                 {step.id !== 4 && (
//                                     <div className="hidden lg:block absolute top-1/2 -right-5 w-10 h-[2px] bg-gradient-to-r from-gray-200 to-transparent transform -translate-y-1/2 z-0 opacity-50"></div>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default HowItWorks;
