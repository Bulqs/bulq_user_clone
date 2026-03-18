"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion'; // <-- Added Variants import
import { Check } from 'lucide-react';
import Link from 'next/link';

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = { // <-- Added : Variants
    hidden: { opacity: 0 }, 
    show: { opacity: 1, transition: { staggerChildren: 0.1 } } 
};

const cardVariants: Variants = { // <-- Added : Variants
    hidden: { opacity: 0, y: 30 }, 
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } 
};

const plans = [
    {
        name: "Pay As You Go",
        price: "Free",
        desc: "Perfect for occasional shoppers.",
        features: ["Free USA/UK Hub Address", "5 Days Free Storage", "Standard Consolidation", "Basic Tracking", "Email Support"],
        highlight: false,
        buttonText: "Sign Up Free"
    },
    {
        name: "Premium Shopper",
        price: "$9.99",
        period: "/mo",
        desc: "Ideal for regular international buyers.",
        features: ["Tax-Free Hub Addresses", "30 Days Free Storage", "Priority Consolidation", "Discounted Shipping Rates", "Free Repacking", "24/7 Priority Support"],
        highlight: true,
        buttonText: "Get Premium"
    },
    {
        name: "Business Forwarder",
        price: "$29.99",
        period: "/mo",
        desc: "For bulk buyers and businesses.",
        features: ["Everything in Premium", "60 Days Free Storage", "API Access for Tracking", "Dedicated Account Manager", "Wholesale Shipping Rates", "Customs Brokerage"],
        highlight: false,
        buttonText: "Contact Sales"
    }
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-appTitleBgColor text-white pt-24 pb-16 px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-appBanner/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-appNav/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Transparent <span className="text-appBanner">Pricing</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 text-lg max-w-2xl mx-auto">
                        No hidden fees. Choose the plan that best fits your shopping habits and start saving on international shipping.
                    </motion.p>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div 
                            key={index} 
                            variants={cardVariants}
                            className={`rounded-3xl p-8 border ${plan.highlight ? 'bg-gradient-to-b from-appNav to-appTitleBgColor border-appBanner shadow-2xl shadow-appBanner/20 relative transform md:-translate-y-4' : 'bg-white/5 border-white/10 backdrop-blur-md'}`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-appBanner text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-gray-400 text-sm mb-6">{plan.desc}</p>
                            <div className="mb-6">
                                <span className="text-5xl font-black">{plan.price}</span>
                                {plan.period && <span className="text-gray-400">{plan.period}</span>}
                            </div>
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-gray-300 text-sm">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 shrink-0 ${plan.highlight ? 'bg-appBanner/20 text-appBanner' : 'bg-white/10 text-white'}`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/pages/register">
                                <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.highlight ? 'bg-appBanner text-white hover:bg-blue-600 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                    {plan.buttonText}
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}