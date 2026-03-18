"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion'; // <-- Added Variants import
import { Globe, Package, ShieldCheck, Truck, FileText, Headphones } from 'lucide-react';
import Link from 'next/link';

// --- FRAMER MOTION VARIANTS ---
const staggerContainer: Variants = { // <-- Added : Variants
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeUpItem: Variants = { // <-- Added : Variants
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const services = [
    { icon: Package, title: "Package Consolidation", desc: "We combine multiple purchases into a single, secure box to reduce your international shipping costs by up to 70%." },
    { icon: Globe, title: "Global Forwarding", desc: "Shop from any US, UK, or China store and we will forward your packages directly to your doorstep in Nigeria." },
    { icon: FileText, title: "Customs Clearance", desc: "Skip the paperwork. Our logistics experts handle all customs declarations and clearance processes seamlessly." },
    { icon: ShieldCheck, title: "Secure Warehousing", desc: "Store your items safely in our climate-controlled hubs for up to 30 days free of charge while you shop." },
    { icon: Truck, title: "Express Delivery", desc: "Partnered with top-tier airlines, we ensure your consolidated packages arrive within 5-7 business days." },
    { icon: Headphones, title: "Dedicated Support", desc: "Real-time tracking and 24/7 customer support via live chat and email to give you complete peace of mind." },
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div initial="hidden" animate="show" variants={staggerContainer} className="text-center mb-16">
                    <motion.h1 variants={fadeUpItem} className="text-4xl md:text-5xl font-extrabold text-appTitleBgColor tracking-tight mb-4">
                        Our <span className="text-appBanner">Services</span>
                    </motion.h1>
                    <motion.p variants={fadeUpItem} className="text-gray-600 text-lg max-w-2xl mx-auto">
                        End-to-end logistics solutions designed to make international shopping and shipping completely effortless.
                    </motion.p>
                </motion.div>

                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.div 
                                key={index} 
                                variants={fadeUpItem}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-appBanner/30 transition-all group"
                            >
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br from-appBanner to-appNav group-hover:text-white text-appBanner transition-colors duration-300">
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{service.desc}</p>
                            </motion.div>
                        )
                    })}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-16 text-center">
                    <Link href="/pages/register">
                        <button className="bg-gradient-to-r from-appBanner to-appNav text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-appBanner/30 hover:scale-105 transition-all">
                            Start Shipping Today
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}