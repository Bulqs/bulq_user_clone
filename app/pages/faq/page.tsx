"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    { question: "How does package consolidation work?", answer: "When you buy items from different stores, we receive them at your dedicated hub. Once you're ready, we combine them into a single box. This reduces the dimensional weight and drastically cuts your shipping costs." },
    { question: "How long does shipping to Nigeria take?", answer: "With our Express Delivery via our airline partners, packages typically arrive in Nigeria within 5 to 7 business days from the moment they leave our US or UK hubs." },
    { question: "Are there any prohibited items I cannot ship?", answer: "Yes. Due to airline regulations and customs laws, we cannot ship hazardous materials, flammable liquids, perishables, firearms, or certain chemicals. Please check our detailed shipping guidelines for a full list." },
    { question: "How are customs duties and taxes handled?", answer: "Our shipping calculator provides an estimated cost that usually covers standard clearance. If your items are high-value and attract specific duties, our customs brokers will notify you and handle the paperwork on your behalf." },
    { question: "How long can I store my items at the hub?", answer: "Standard users get 5 days of free storage, while Premium users enjoy up to 30 days. This gives you plenty of time to wait for multiple orders to arrive before consolidating them." }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-extrabold text-appTitleBgColor tracking-tight mb-4">
                        Frequently Asked <span className="text-appBanner">Questions</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-600 text-lg">
                        Got questions about shipping, consolidation, or pricing? We've got answers.
                    </motion.p>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <button 
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                >
                                    <span className={`font-bold text-lg ${isOpen ? 'text-appBanner' : 'text-gray-800'}`}>
                                        {faq.question}
                                    </span>
                                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                        <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-appBanner' : 'text-gray-400'}`} />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </motion.div>
            </div>
        </div>
    );
}