"use client";
import React, { MouseEvent } from 'react';
import { IoStar } from "react-icons/io5";
import { FaQuoteLeft } from "react-icons/fa";
import { motion, useMotionTemplate, useMotionValue, Variants } from 'framer-motion'; // <--- Add Variants here

// --- THE DATA ---
interface Testimonial {
    id: number;
    name: string;
    location: string;
    text: string;
    rating: number;
    gradient: string;
}
// --- ORCHESTRATED ANIMATION VARIANTS ---

// const containerVariants: Variants = { // <--- ADD : Variants
//     hidden: { opacity: 0 },
//     show: {
//         opacity: 1,
//         transition: {
//             staggerChildren: 0.25,
//             delayChildren: 0.1,
//         }
//     }
// };

const cardVariants: Variants = { // <--- ADD : Variants
    hidden: { 
        opacity: 0, 
        scale: 0.5,
        y: 120,
        rotateX: -30
    },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        transition: {
            type: "spring", // TypeScript will now recognize this perfectly!
            stiffness: 140,
            damping: 14,
            mass: 1.2
        }
    }
};

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'John Doe',
        location: 'London, UK',
        text: "The consolidation service is amazing. I ordered from 5 different stores and BulQ combined everything into one package, saving me over 60% on shipping.",
        rating: 5,
        gradient: 'from-blue-400 to-blue-600'
    },
    {
        id: 2,
        name: 'Emma Rodriguez',
        location: 'Oklahoma, USA',
        text: "I love the flexibility of the Premium plan. Weekly deliveries mean I never have to wait long for my purchases, and the insurance gives me peace of mind.",
        rating: 4,
        gradient: 'from-purple-400 to-purple-600'
    },
    {
        id: 3,
        name: 'Mitsuo JR',
        location: 'Tokyo, Japan',
        text: "BulQ has saved me so much on international shipping. I can shop from US stores and get everything delivered to Japan at a fraction of the cost!",
        rating: 5,
        gradient: 'from-orange-400 to-red-500'
    },
];

// --- ORCHESTRATED ANIMATION VARIANTS ---
// This parent variant controls the timing of the sequence
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.25, // This is the magic! 0.25s delay between each card popping
            delayChildren: 0.1,    // Wait a tiny bit before starting the cascade
        }
    }
};

// This child variant controls the actual "Pop Out" physics for each card
// const cardVariants = {
//     hidden: { 
//         opacity: 0, 
//         scale: 0.5,     // Starts at half size
//         y: 120,         // Starts lower down
//         rotateX: -30    // Starts tilted away from the user
//     },
//     show: {
//         opacity: 1,
//         scale: 1,
//         y: 0,
//         rotateX: 0,
//         transition: {
//             type: "spring",
//             stiffness: 140, // How "tight" the spring is
//             damping: 14,    // How much friction (lower = more bouncy)
//             mass: 1.2       // Weight of the card
//         }
//     }
// };

// --- 4D TESTIMONIAL CARD COMPONENT ---
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            variants={cardVariants} // Connects to the staggered parent sequence
            onMouseMove={handleMouseMove}
            whileHover={{ scale: 1.03, rotateX: 4, rotateY: -4, transition: { duration: 0.2 } }}
            style={{ transformStyle: "preserve-3d" }}
            className="group relative bg-white border border-gray-100 p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:border-blue-100 transition-colors duration-500 cursor-default h-full flex flex-col"
        >
            {/* 4D LIGHT SPOTLIGHT */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            400px circle at ${mouseX}px ${mouseY}px,
                            rgba(59, 130, 246, 0.06), 
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* Decorative Quote Icon (Pushes BACK into the card on hover) */}
            <div className="absolute top-8 right-8 opacity-5 group-hover:opacity-10 transition-all duration-500 pop-in z-0">
                <FaQuoteLeft className="text-8xl text-blue-600" />
            </div>

            {/* Stars (Pops slightly out) */}
            <div className="mb-6 flex gap-1 pop-out-slight relative z-10">
                {[...Array(5)].map((_, i) => (
                    <IoStar
                        key={i}
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'}`}
                    />
                ))}
            </div>

            {/* Text (Pops out to the front) */}
            <blockquote className="mb-8 flex-grow pop-out relative z-10">
                <p className="text-gray-700 leading-relaxed italic text-lg font-medium group-hover:text-gray-900 transition-colors duration-300">
                    "{testimonial.text}"
                </p>
            </blockquote>

            {/* User Info (Pops out massively) */}
            <div className="flex items-center gap-4 mt-auto pop-out-extreme relative z-10 pt-4 border-t border-gray-50 group-hover:border-blue-50 transition-colors duration-300">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:shadow-lg transition-all duration-300 ring-4 ring-white`}>
                    {testimonial.name.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-base">{testimonial.name}</h4>
                    <p className="text-sm text-blue-600 font-semibold">{testimonial.location}</p>
                </div>
            </div>
        </motion.div>
    );
};

// --- MAIN SECTION COMPONENT ---
const TrustedByShopper = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
            
            {/* Custom CSS for Z-axis 3D popping on hover */}
            <style jsx>{`
                .pop-out { transform: translateZ(0px); transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
                .pop-out-slight { transform: translateZ(0px); transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
                .pop-out-extreme { transform: translateZ(0px); transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
                .pop-in { transform: translateZ(0px); transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1); }
                
                /* Hover Effects */
                .group:hover .pop-out { transform: translateZ(40px); }
                .group:hover .pop-out-slight { transform: translateZ(20px); }
                .group:hover .pop-out-extreme { transform: translateZ(60px) scale(1.05); }
                .group:hover .pop-in { transform: translateZ(-30px) scale(0.9); } 
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Testimonials</h2>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Trusted by Shoppers Worldwide
                    </h3>
                    <p className="text-xl text-gray-500 font-medium">
                        Join thousands of happy customers who ship with BulQ every day.
                    </p>
                </motion.div>

                {/* The "Stagger" Container */}
                <motion.div 
                    variants={containerVariants} // Links the stagger logic
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }} // Triggers slightly before scrolling into full view
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-10" 
                    style={{ perspective: "1200px" }}
                >
                    {testimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TrustedByShopper;

// import React from 'react';
// import { IoStar } from "react-icons/io5";
// import { FaQuoteLeft } from "react-icons/fa"; // Correct icon import

// interface Testimonial {
//     id: number;
//     name: string;
//     location: string;
//     text: string;
//     rating: number;
//     gradient: string;
// }

// const TrustedByShopper = () => {
//     const testimonials: Testimonial[] = [
//         {
//             id: 1,
//             name: 'John Doe',
//             location: 'London, UK',
//             text: "The consolidation service is amazing. I ordered from 5 different stores and BulQ combined everything into one package, saving me over 60% on shipping.",
//             rating: 5,
//             gradient: 'from-blue-400 to-blue-600'
//         },
//         {
//             id: 2,
//             name: 'Emma Rodriguez',
//             location: 'Oklahoma, USA',
//             text: "I love the flexibility of the Premium plan. Weekly deliveries mean I never have to wait long for my purchases, and the insurance gives me peace of mind.",
//             rating: 4,
//             gradient: 'from-purple-400 to-purple-600'
//         },
//         {
//             id: 3,
//             name: 'Mitsuo JR',
//             location: 'Tokyo, Japan',
//             text: "BulQ has saved me so much on international shipping. I can shop from US stores and get everything delivered to Japan at a fraction of the cost!",
//             rating: 5,
//             gradient: 'from-orange-400 to-red-500'
//         },
//     ];

//     const renderStars = (rating: number) => {
//         return (
//             <div className="flex gap-1">
//                 {[...Array(5)].map((_, i) => (
//                     <IoStar
//                         key={i}
//                         className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
//                     />
//                 ))}
//             </div>
//         );
//     };

//     return (
//         <section className="py-20 bg-white relative overflow-hidden">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
//                 {/* Header */}
//                 <div className="text-center max-w-3xl mx-auto mb-16">
//                     <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Testimonials</h2>
//                     <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
//                         Trusted by Shoppers Worldwide
//                     </h3>
//                     <p className="text-lg text-gray-500">
//                         Join thousands of happy customers who ship with BulQ every day.
//                     </p>
//                 </div>

//                 {/* Cards Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                     {testimonials.map((testimonial) => (
//                         <div
//                             key={testimonial.id}
//                             className="group relative bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
//                         >
//                             {/* Decorative Quote Icon - Fixed */}
//                             <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
//                                 <FaQuoteLeft className="text-6xl text-appBanner" />
//                             </div>

//                             {/* Stars */}
//                             <div className="mb-6">
//                                 {renderStars(testimonial.rating)}
//                             </div>

//                             {/* Text */}
//                             <blockquote className="mb-8">
//                                 <p className="text-gray-700 leading-relaxed italic relative z-10">
//                                     "{testimonial.text}"
//                                 </p>
//                             </blockquote>

//                             {/* User Info */}
//                             <div className="flex items-center gap-4 mt-auto">
//                                 <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
//                                     {testimonial.name.charAt(0)}
//                                 </div>
//                                 <div>
//                                     <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
//                                     <p className="text-xs text-gray-500 font-medium">{testimonial.location}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default TrustedByShopper;