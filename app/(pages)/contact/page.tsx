"use client";

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion'; // <-- Added Variants import
import { Mail, Phone, MapPin, Send } from 'lucide-react';

// --- FRAMER MOTION VARIANTS ---
const staggerContainer: Variants = { // <-- Extracted and strongly typed
    hidden: { opacity: 0 }, 
    show: { opacity: 1, transition: { staggerChildren: 0.1 } } 
};

const fadeUpItem: Variants = { // <-- Added : Variants
    hidden: { opacity: 0, y: 20 }, 
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } 
};

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            alert("Message sent successfully!");
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-appTitleBgColor pt-24 pb-16 px-4 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-appBanner/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                        Get in <span className="text-appBanner">Touch</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Whether you have a question about shipping rates, customs, or your current package, our team is ready to help.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side: Contact Info */}
                    <motion.div initial="hidden" animate="show" variants={staggerContainer} className="space-y-8">
                        <motion.div variants={fadeUpItem} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                            <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-appBanner/20 rounded-xl flex items-center justify-center text-appBanner shrink-0"><MapPin className="w-6 h-6" /></div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Global Hub</h4>
                                        <p className="text-gray-400 text-sm">123 Logistics Way, Suite 400<br/>New Castle, DE 19720, USA</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-appBanner/20 rounded-xl flex items-center justify-center text-appBanner shrink-0"><Mail className="w-6 h-6" /></div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Email Us</h4>
                                        <p className="text-gray-400 text-sm">support@bulq.com<br/>partnerships@bulq.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-appBanner/20 rounded-xl flex items-center justify-center text-appBanner shrink-0"><Phone className="w-6 h-6" /></div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Call Us</h4>
                                        <p className="text-gray-400 text-sm">+1 (800) 123-4567<br/>Mon-Fri, 9am - 6pm EST</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Side: Form */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl">
                        <h3 className="text-2xl font-bold text-appTitleBgColor mb-6">Send us a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                    <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-appBanner focus:outline-none" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                    <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-appBanner focus:outline-none" placeholder="Doe" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <input required type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-appBanner focus:outline-none" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                <textarea required rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-appBanner focus:outline-none resize-none" placeholder="How can we help you today?"></textarea>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-appBanner to-appNav text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isSubmitting ? "Sending..." : <><Send className="w-5 h-5" /> Send Message</>}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}