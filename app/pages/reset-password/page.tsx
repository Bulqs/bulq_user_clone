"use client";
import React, { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { IoCheckmarkCircle, IoCloseCircle, IoShieldCheckmark, IoLockClosed, IoKey } from "react-icons/io5";
import { CgSpinnerTwo } from "react-icons/cg";
import InputField from '@/app/components/inputs/InputField';
import Button from '@/app/components/inputs/Button';
import { completePasswordReset } from '@/lib/user/actions';

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

// --- CORE CONTENT COMPONENT ---
const ResetPasswordContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'invalid_token'>('idle');
    const [error, setError] = useState('');

    // Check for token on mount
    useEffect(() => {
        if (!token) {
            setStatus('invalid_token');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 1. Strict Client-Side Validation
        if (!password || !confirmPassword) {
            setError('Please fill in both password fields.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match. Please verify your input.');
            return;
        }

        setStatus('loading');

        try {
            // Ensure you have the token
            if (!token) throw new Error("Missing secure token.");

            // 2. Build the payload matching your ResetPasswordRequest type
            // Note: Adjust 'newPassword' if your backend expects a different key like 'password'
            const payload = { newPassword: password }; 

            // 3. Call your completePasswordReset function
            const responseMessage = await completePasswordReset(token, payload as any);
            
            console.log("Password reset successful:", responseMessage);
            
            // 4. Trigger the glowing success animation
            setStatus('success');
            
        } catch (err: any) {
            setStatus('idle');
            setError(err.message || "An error occurred while resetting your password.");
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={status}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="relative z-10 w-full max-w-md bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] p-8 md:p-10 text-center overflow-hidden"
            >
                {/* --- STATE 1: MISSING TOKEN --- */}
                {status === 'invalid_token' && (
                    <div className="flex flex-col items-center justify-center space-y-6 py-4">
                        <motion.div variants={iconVariants} className="relative z-10 bg-red-500/20 rounded-full p-4 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                            <IoCloseCircle className="text-6xl text-red-400" />
                        </motion.div>
                        <div className="relative z-10 space-y-2">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Invalid Request</h2>
                            <p className="text-gray-300 font-medium">No secure token found. Please use the link sent to your email.</p>
                        </div>
                        <Button onClick={() => router.push('/pages/forgot-password')} className="w-full mt-4 bg-appNav hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-lg">
                            Request New Link
                        </Button>
                    </div>
                )}

                {/* --- STATE 2: IDLE (INPUT FORM) --- */}
                {status === 'idle' && (
                    <div className="flex flex-col items-center">
                        <motion.div variants={iconVariants} className="relative w-20 h-20 mb-6 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                            <IoKey className="text-4xl text-blue-400" />
                        </motion.div>

                        <motion.h2 variants={itemVariants} className="text-3xl font-extrabold text-white tracking-tight mb-2">
                            Create New Password
                        </motion.h2>
                        
                        <motion.p variants={itemVariants} className="text-gray-400 font-medium mb-8 text-sm">
                            Your new password must be unique and at least 8 characters long.
                        </motion.p>

                        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="w-full space-y-5">
                            {error && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center font-medium">
                                    {error}
                                </motion.div>
                            )}
                            
                            <div className="text-left w-full space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                                        New Password
                                    </label>
                                    <InputField 
                                        type="password" 
                                        name="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        placeholder="Enter new password" 
                                        required 
                                        className="w-full px-4 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all shadow-inner"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
                                        Confirm Password
                                    </label>
                                    <InputField 
                                        type="password" 
                                        name="confirmPassword" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        placeholder="Repeat new password" 
                                        required 
                                        className={`w-full px-4 py-4 rounded-xl bg-white/5 backdrop-blur-sm border text-white placeholder-gray-500 focus:bg-white/10 focus:ring-2 outline-none transition-all shadow-inner
                                            ${confirmPassword && password !== confirmPassword ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:ring-blue-500/50'}
                                        `}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="group w-full mt-2 bg-appNav hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-lg flex justify-center items-center gap-2 overflow-hidden relative">
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                <span>Secure My Account</span>
                                <IoLockClosed className="text-xl group-hover:scale-110 transition-transform" />
                            </Button>
                        </motion.form>
                    </div>
                )}

                {/* --- STATE 3: LOADING --- */}
                {status === 'loading' && (
                    <div className="flex flex-col items-center justify-center space-y-6 py-8">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-t-2 border-b-2 border-blue-500 opacity-50" />
                            <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-2 rounded-full border-r-2 border-l-2 border-appNav opacity-70" />
                            <IoShieldCheckmark className="text-4xl text-blue-400 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Encrypting...</h2>
                        <p className="text-gray-400 font-medium">Applying your new security credentials.</p>
                    </div>
                )}

                {/* --- STATE 4: SUCCESS --- */}
                {status === 'success' && (
                    <div className="flex flex-col items-center justify-center space-y-6 py-4">
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/20 blur-[60px] rounded-full pointer-events-none" />
                        
                        <motion.div variants={iconVariants} className="relative z-10 bg-green-500/20 rounded-full p-5 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                            <IoCheckmarkCircle className="text-6xl text-green-400" />
                        </motion.div>
                        
                        <div className="relative z-10 space-y-3">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Password Updated!</h2>
                            <p className="text-gray-300 font-medium leading-relaxed">
                                Your account is completely secure. You can now log in with your new credentials.
                            </p>
                        </div>
                        
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full pt-6 relative z-10">
                            <Button onClick={() => router.push('/pages/signin')} className="w-full bg-appNav hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-lg">
                                Proceed to Login
                            </Button>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

// --- MAIN PAGE WRAPPER ---
export default function ResetPasswordPage() {
    return (
        <div 
            className="min-h-screen w-full flex flex-col items-center justify-center bg-black/80 bg-blend-overlay p-4 sm:p-6 relative overflow-hidden"
            style={{ backgroundImage: "url('/images/shipping.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-[#0F172A]/80 pointer-events-none" />

            <div className="absolute top-8 md:top-12 z-20">
                <Image src="/images/logo5.svg" alt="BulQ Logo" width={180} height={45} className="w-32 md:w-48 h-auto drop-shadow-lg" />
            </div>

            <Suspense fallback={
                <div className="flex items-center justify-center space-x-2 text-white z-10">
                    <CgSpinnerTwo className="animate-spin text-4xl text-blue-500" />
                    <span className="font-bold text-xl drop-shadow-md">Verifying Link...</span>
                </div>
            }>
                <ResetPasswordContent />
            </Suspense>
        </div>
    );
}