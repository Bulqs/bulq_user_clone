"use client";
import React, { MouseEvent } from 'react';
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

// --- THE DATA ---
const plans = [
    {
        id: 1,
        price: '$80',
        period: '/mo',
        title: 'Basic',
        tag: null,
        features: ['Up to 10 deliveries per month', 'No repacking', 'Pay-per-shipment insurance', 'Monthly delivery frequency'],
        buttonText: 'Coming Soon...',
        isPopular: false,
    },
    {
        id: 2,
        price: '$150',
        period: '/mo',
        title: 'Standard',
        tag: 'Most Popular',
        features: ['Up to 20 deliveries per month', 'Bi-weekly delivery options', 'Light repacking included', 'Insurance up to $500 included'],
        buttonText: 'Coming Soon...',
        isPopular: true,
    },
    {
        id: 3,
        price: '$250',
        period: '/mo',
        title: 'Premium',
        tag: null,
        features: ['Up to 40 deliveries per month', 'Weekly delivery options', 'Full repacking/consolidation', 'Insurance up to $2,000 included'],
        buttonText: 'Coming Soon...',
        isPopular: false,
    },
    {
        id: 4,
        price: 'based on shipping cost',
        period: '/of',
        title: 'No Plan',
        tag: null,
        features: ['Ship as many packages as you want', 'Weekly delivery options', 'Full repacking/consolidation', 'Flexible Insurance calculated at point of payment'],
        buttonText: 'Available now',
        isPopular: true,
    }
];

// --- 4D CARD COMPONENT ---
// We separate this so each card can track its own mouse coordinates for the spotlight
const PricingCard = ({ plan, index }: { plan: any, index: number }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Track mouse movement inside the card
    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: index * 0.2, type: "spring", bounce: 0.4 }}
            onMouseMove={handleMouseMove}
            whileHover={{ scale: 1.03, y: -10 }}
            className={`group relative flex flex-col bg-gray-900 rounded-3xl overflow-hidden cursor-pointer
                ${plan.isPopular ? 'border-2 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.2)] z-10 md:scale-105' : 'border border-gray-800 shadow-xl'}
            `}
        >
            {/* THE 4D SPOTLIGHT EFFECT */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            600px circle at ${mouseX}px ${mouseY}px,
                            ${plan.isPopular ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.08)'},
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* Popular Tag */}
            {plan.isPopular && (
                <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-bold uppercase tracking-widest py-2 text-center shadow-lg">
                    Most Popular
                </div>
            )}

            <div className={`relative z-10 p-8 flex-grow ${plan.isPopular ? 'pt-12' : 'pt-8'}`}>
                <h3 className={`text-xl font-bold mb-2 ${plan.isPopular ? 'text-blue-400' : 'text-gray-300'}`}>{plan.title}</h3>
                <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-extrabold text-white tracking-tight">{plan.price}</span>
                    <span className="text-lg text-gray-400 font-medium ml-1">{plan.period}</span>
                </div>

                <div className="w-full h-px bg-gray-800 mb-6 group-hover:bg-gray-700 transition-colors"></div>

                <ul className="space-y-4 mb-8">
                    {plan.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                            <IoCheckmarkCircleSharp className={`w-6 h-6 shrink-0 mr-3 ${plan.isPopular ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-200 transition-colors'}`} />
                            <span className="text-gray-300 font-medium text-sm leading-relaxed">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="relative z-10 p-8 pt-0 mt-auto">
                <button
                    className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300
                        ${plan.isPopular 
                            ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:bg-blue-500 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]' 
                            : 'bg-gray-800 text-white group-hover:bg-gray-700'
                        }
                    `}
                >
                    {plan.buttonText}
                </button>
            </div>
        </motion.div>
    );
};

// --- MAIN SECTION COMPONENT ---
const PlanSubscription = () => {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-30">
                <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-1/4 w-96 h-96 bg-blue-900 rounded-full mix-blend-screen filter blur-[100px]"
                />
                <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-900 rounded-full mix-blend-screen filter blur-[100px]"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.2em] mb-3">Pricing</h2>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
                        Flexible Subscription Plans
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choose the perfect plan that fits your global shopping needs. Upgrade or cancel anytime.
                    </p>
                </motion.div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {plans.map((plan, index) => (
                        <PricingCard key={plan.id} plan={plan} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlanSubscription;

// import React from 'react';
// import { IoCheckmarkCircleSharp, IoStar } from "react-icons/io5";

// const PlanSubscription = () => {
//     const plans = [
//         {
//             id: 1,
//             price: '$80',
//             period: '/mo',
//             title: 'Basic',
//             tag: null,
//             features: [
//                 'Up to 10 deliveries per month',
//                 'No repacking',
//                 'Pay-per-shipment insurance',
//                 'Monthly delivery frequency'
//             ],
//             buttonText: 'Get Basic',
//             isPopular: false,
//             accentColor: 'text-gray-900'
//         },
//         {
//             id: 2,
//             price: '$150',
//             period: '/mo',
//             title: 'Standard',
//             tag: 'Most Popular',
//             features: [
//                 'Up to 20 deliveries per month',
//                 'Bi-weekly delivery options',
//                 'Light repacking included',
//                 'Insurance up to $500 included'
//             ],
//             buttonText: 'Get Standard',
//             isPopular: true,
//             accentColor: 'text-blue-600'
//         },
//         {
//             id: 3,
//             price: '$250',
//             period: '/mo',
//             title: 'Premium',
//             tag: null,
//             features: [
//                 'Up to 40 deliveries per month',
//                 'Weekly delivery options',
//                 'Full repacking/consolidation',
//                 'Insurance up to $2,000 included'
//             ],
//             buttonText: 'Get Premium',
//             isPopular: false,
//             accentColor: 'text-appTitleBgColor' // Assuming this maps to a valid color class or hex
//         }
//     ];

//     return (
//         <section className="py-20 px-4 sm:px-6 lg:px-8 bg-appNav relative overflow-hidden">
//             {/* Background Decor (Optional Subtle Glow) */}
//             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-20">
//                 <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
//                 <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
//             </div>

//             <div className="relative z-10 max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="text-center mb-16">
//                     <h2 className="text-lg font-bold text-blue-400 uppercase tracking-wider mb-2">Pricing</h2>
//                     <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
//                         Flexible Subscription Plans
//                     </h1>
//                     <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//                         Choose the perfect plan that fits your global shopping needs. Upgrade or cancel anytime.
//                     </p>
//                 </div>

//                 {/* Plans Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
//                     {plans.map((plan) => (
//                         <div
//                             key={plan.id}
//                             className={`relative flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300 
//                                 ${plan.isPopular 
//                                     ? 'shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-100 md:-translate-y-4 md:scale-105 z-10 border-2 border-blue-500' 
//                                     : 'shadow-xl hover:shadow-2xl border border-gray-100 hover:-translate-y-2 opacity-95 hover:opacity-100'
//                                 }
//                             `}
//                         >
//                             {/* Popular Tag */}
//                             {plan.isPopular && (
//                                 <div className="absolute top-0 left-0 w-full bg-blue-600 text-white text-xs font-bold uppercase tracking-widest py-2 text-center">
//                                     Most Popular
//                                 </div>
//                             )}

//                             <div className={`p-8 ${plan.isPopular ? 'pt-12' : 'pt-8'}`}>
//                                 {/* Title & Price */}
//                                 <h3 className={`text-xl font-bold mb-2 ${plan.accentColor}`}>{plan.title}</h3>
//                                 <div className="flex items-baseline mb-6">
//                                     <span className="text-5xl font-extrabold text-gray-900 tracking-tight">{plan.price}</span>
//                                     <span className="text-lg text-gray-500 font-medium ml-1">{plan.period}</span>
//                                 </div>

//                                 {/* Divider */}
//                                 <div className="w-full h-px bg-gray-100 mb-6"></div>

//                                 {/* Features List */}
//                                 <ul className="space-y-4 mb-8">
//                                     {plan.features.map((feature, idx) => (
//                                         <li key={idx} className="flex items-start">
//                                             <IoCheckmarkCircleSharp className={`w-6 h-6 shrink-0 mr-3 ${plan.isPopular ? 'text-blue-600' : 'text-green-500'}`} />
//                                             <span className="text-gray-700 font-medium text-sm leading-relaxed">
//                                                 {feature}
//                                             </span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>

//                             {/* Button Footer */}
//                             <div className="p-8 pt-0 mt-auto">
//                                 <button
//                                     className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 transform hover:scale-[1.02] shadow-md
//                                         ${plan.isPopular 
//                                             ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
//                                             : 'bg-gray-900 text-white hover:bg-gray-800'
//                                         }
//                                     `}
//                                 >
//                                     {plan.buttonText}
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default PlanSubscription;