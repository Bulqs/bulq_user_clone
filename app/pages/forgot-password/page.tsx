"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { IoMail, IoShieldCheckmark, IoArrowBack, IoLockClosed } from "react-icons/io5";
import { CgSpinnerTwo } from "react-icons/cg";
import InputField from '@/app/components/inputs/InputField';
import Button from '@/app/components/inputs/Button';

// --- FRAMER MOTION VARIANTS ---
const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25, staggerChildren: 0.1 } },
    exit: { opacity: 0, scale: 0.95, y: -30, transition: { duration: 0.2 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 20 } }
};

const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -20 },
    show: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 12, delay: 0.1 } }
};

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        setStatus('loading');

        try {
            // =========================================================================
            // TODO: Plug your actual API call here!
            // const res = await fetch('http://35.188.106.61/api/v1/auth/forgot-password', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email })
            // });
            // if (!res.ok) throw new Error("Failed to send reset link.");
            // =========================================================================

            // Simulating a network request for the premium loading animation
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setStatus('success');
        } catch (err: any) {
            setStatus('idle');
            setError(err.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div 
            className="min-h-screen w-full flex flex-col items-center justify-center bg-black/80 bg-blend-overlay p-4 sm:p-6 relative overflow-hidden"
            style={{ backgroundImage: "url('/images/shipping.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
            {/* Cinematic overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-[#0F172A]/80 pointer-events-none" />

            {/* Logo */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute top-8 md:top-12 z-20 cursor-pointer"
                onClick={() => router.push('/pages/home')}
            >
                <Image src="/images/logo5.svg" alt="BulQ Logo" width={180} height={45} className="w-32 md:w-48 h-auto drop-shadow-lg" />
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={status} // Key changes force Framer Motion to animate the exit/enter cycle!
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="relative z-10 w-full max-w-md bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] p-8 md:p-10 text-center overflow-hidden"
                >
                    
                    {/* --- STATE 1: IDLE (INPUT FORM) --- */}
                    {status === 'idle' && (
                        <div className="flex flex-col items-center">
                            {/* Animated Lock Icon */}
                            <motion.div variants={iconVariants} className="relative w-20 h-20 mb-6 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                                <IoLockClosed className="text-4xl text-blue-400" />
                                <div className="absolute top-0 right-0 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                            </motion.div>

                            <motion.h2 variants={itemVariants} className="text-3xl font-extrabold text-white tracking-tight mb-2">
                                Forgot Password?
                            </motion.h2>
                            
                            <motion.p variants={itemVariants} className="text-gray-400 font-medium mb-8">
                                No worries! Enter your email address below and we'll send you a secure link to reset it.
                            </motion.p>

                            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="w-full space-y-5">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
                                        {error}
                                    </div>
                                )}
                                
                                <div className="text-left w-full">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                                        Email Address
                                    </label>
                                    <InputField 
                                        type="email" 
                                        name="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="Enter your registered email" 
                                        required 
                                        className="w-full px-4 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all shadow-inner"
                                    />
                                </div>

                                <Button type="submit" className="group w-full bg-appNav hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-lg flex justify-center items-center gap-2 overflow-hidden relative">
                                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                    <span>Send Reset Link</span>
                                    <IoMail className="text-xl group-hover:scale-110 transition-transform" />
                                </Button>
                            </motion.form>

                            <motion.div variants={itemVariants} className="mt-8 w-full border-t border-white/10 pt-6">
                                <button 
                                    onClick={() => router.push('/pages/signin')}
                                    className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors w-full font-medium"
                                >
                                    <IoArrowBack className="text-lg" />
                                    <span>Back to Login</span>
                                </button>
                            </motion.div>
                        </div>
                    )}

                    {/* --- STATE 2: LOADING --- */}
                    {status === 'loading' && (
                        <div className="flex flex-col items-center justify-center space-y-6 py-8">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-t-2 border-b-2 border-blue-500 opacity-50" />
                                <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-2 rounded-full border-r-2 border-l-2 border-appNav opacity-70" />
                                <IoShieldCheckmark className="text-4xl text-blue-400 animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Securing Request...</h2>
                            <p className="text-gray-400 font-medium">Generating your password reset token.</p>
                        </div>
                    )}

                    {/* --- STATE 3: SUCCESS --- */}
                    {status === 'success' && (
                        <div className="flex flex-col items-center justify-center space-y-6 py-4">
                            {/* Glowing Background */}
                            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/20 blur-[60px] rounded-full pointer-events-none" />
                            
                            <motion.div variants={iconVariants} className="relative z-10 bg-green-500/20 rounded-full p-5 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                                <IoMail className="text-6xl text-green-400" />
                            </motion.div>
                            
                            <div className="relative z-10 space-y-3">
                                <h2 className="text-3xl font-extrabold text-white tracking-tight">Check Your Inbox!</h2>
                                <p className="text-gray-300 font-medium leading-relaxed">
                                    We sent a password reset link to<br/>
                                    <strong className="text-white px-2 py-1 bg-white/5 rounded-md mt-1 inline-block border border-white/10">{email}</strong>
                                </p>
                            </div>
                            
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full pt-6 relative z-10">
                                <Button onClick={() => router.push('/pages/signin')} className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold transition-all backdrop-blur-sm active:scale-95 text-lg border border-white/10">
                                    Return to Login
                                </Button>
                            </motion.div>
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </div>
    );
}