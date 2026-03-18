"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { UserPlus, ShoppingCart, PackageOpen, PlaneTakeoff, Home, ArrowRight } from 'lucide-react';

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const steps = [
    { 
        icon: UserPlus, 
        title: "Get Your Global Address", 
        desc: "Create a free BulQ account and instantly receive your own dedicated, tax-free shipping addresses in the US, UK, and China." 
    },
    { 
        icon: ShoppingCart, 
        title: "Shop at Your Favorite Stores", 
        desc: "Shop online at Amazon, Zara, BestBuy, or any global retailer. At checkout, simply enter your new BulQ hub address as the delivery destination." 
    },
    { 
        icon: PackageOpen, 
        title: "We Receive & Consolidate", 
        desc: "As your packages arrive at our hub, we inspect them, notify you, and securely store them. We combine multiple orders into one single box to save you up to 70% on shipping costs." 
    },
    { 
        icon: PlaneTakeoff, 
        title: "Fast International Forwarding", 
        desc: "Once you are ready, request a shipment. We dispatch your consolidated package via our premium airline partners within 24 hours." 
    },
    { 
        icon: Home, 
        title: "Delivered to Your Doorstep", 
        desc: "Track your shipment in real-time on your dashboard until it arrives safely at your home or office in Nigeria in just 5-7 business days." 
    }
];

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-appTitleBgColor text-white pt-24 pb-20 px-4 relative overflow-hidden">
            {/* --- BACKGROUND GLOWS --- */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-appBanner/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-appNav/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                
                {/* --- HERO SECTION --- */}
                <div className="text-center mb-20">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <span className="text-appBanner font-bold text-sm tracking-widest uppercase">The BulQ Journey</span>
                    </motion.div>
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-appBanner">Works</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Cross-border shopping doesn't have to be complicated. Experience seamless, cost-effective global shipping in 5 simple steps.
                    </motion.p>
                </div>

                {/* --- TIMELINE SECTION --- */}
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="relative max-w-3xl mx-auto">
                    
                    {/* The glowing vertical line connecting the steps */}
                    <div className="absolute left-8 md:left-12 top-10 bottom-10 w-1 bg-gradient-to-b from-appBanner/50 via-appNav/50 to-transparent rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

                    <div className="space-y-12 md:space-y-16">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isLast = index === steps.length - 1;

                            return (
                                <motion.div key={index} variants={itemVariants} className="relative flex items-start group">
                                    
                                    {/* Timeline Node / Icon */}
                                    <div className="relative z-10 flex flex-col items-center justify-center mr-6 md:mr-10 shrink-0">
                                        <div className="w-16 h-16 md:w-24 md:h-24 bg-appTitleBgColor rounded-2xl flex items-center justify-center border-2 border-white/10 group-hover:border-appBanner group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300 relative overflow-hidden">
                                            {/* Node Background Glow */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-appBanner/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            
                                            {/* Step Number Badge */}
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-appBanner rounded-full flex items-center justify-center text-xs font-black shadow-lg">
                                                {index + 1}
                                            </div>
                                            
                                            <Icon className="w-7 h-7 md:w-10 md:h-10 text-gray-400 group-hover:text-white transition-colors duration-300 relative z-10" />
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="flex-1 bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-sm hover:bg-white/[0.07] transition-colors mt-2 md:mt-4">
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-wide group-hover:text-appBanner transition-colors duration-300">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                                            {step.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* --- CALL TO ACTION --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-24 text-center bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-10 md:p-16 rounded-[3rem] relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-appBanner/5" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight">
                            Ready to start your global shopping spree?
                        </h2>
                        <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg">
                            Join thousands of users who trust BulQ to deliver their international packages safely and affordably.
                        </p>
                        <Link href="/pages/register" passHref legacyBehavior>
                            <motion.a 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-appBanner to-appNav text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all cursor-pointer"
                            >
                                Create Your Free Account <ArrowRight className="w-5 h-5" />
                            </motion.a>
                        </Link>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}