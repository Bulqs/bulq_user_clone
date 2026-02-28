"use client";
import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IoCheckmarkCircle, IoCloseCircle, IoShieldCheckmark } from "react-icons/io5";
import { CgSpinnerTwo } from "react-icons/cg";
import Image from 'next/image';
import Button from '@/app/components/inputs/Button';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { AccountVerifiedViewDTO } from '@/types/user';
import { verifyUserAccount } from '@/lib/user/actions';

// --- ANIMATION VARIANTS ---
const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.9, y: -30, transition: { duration: 0.2 } }
};

const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -45 },
    show: { scale: 1, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 12, delay: 0.2 } }
};

// --- CORE VERIFICATION COMPONENT ---
const VerificationContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');
    const [verifiedEmail, setVerifiedEmail] = useState<string>(''); 

    // NEW: Ref to prevent React Strict Mode from double-firing the API
    const hasAttemptedVerification = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMessage("No verification token found in the URL.");
            return;
        }

        // NEW: If we already fired the request, don't fire it again!
        if (hasAttemptedVerification.current) return;
        hasAttemptedVerification.current = true;

        const verifyAccount = async () => {
            try {
                const response: AccountVerifiedViewDTO = await verifyUserAccount(token);
                
                if (response && response.email) {
                    setVerifiedEmail(response.email);
                }

                setStatus('success');
            } catch (error: any) {
                setStatus('error');
                setErrorMessage(error.message || "The verification link is invalid or has expired.");
            }
        };

        verifyAccount();
    }, [token]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={status}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="relative z-10 w-full max-w-lg bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] p-8 md:p-12 text-center overflow-hidden"
            >
                {/* --- LOADING STATE --- */}
                {status === 'loading' && (
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-t-2 border-b-2 border-blue-500 opacity-50"
                            />
                            <motion.div 
                                animate={{ rotate: -360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-2 rounded-full border-r-2 border-l-2 border-appNav opacity-70"
                            />
                            <IoShieldCheckmark className="text-4xl text-blue-400 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Verifying Secure Token</h2>
                        <p className="text-gray-400 font-medium">Please wait while we confirm your identity...</p>
                    </div>
                )}

                {/* --- SUCCESS STATE --- */}
                {status === 'success' && (
                    <div className="flex flex-col items-center justify-center space-y-6">
                        {/* Glowing Background for Success */}
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/20 blur-[60px] rounded-full pointer-events-none"
                        />
                        
                        <motion.div variants={iconVariants} className="relative z-10 bg-green-500/20 rounded-full p-4 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                            <IoCheckmarkCircle className="text-6xl text-green-400" />
                        </motion.div>
                        
                        <div className="relative z-10 space-y-2">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Email Verified!</h2>
                            <p className="text-gray-300 font-medium">
                                Your account <strong className="text-white px-1">{verifiedEmail}</strong> is now fully active and ready to use.
                            </p>
                        </div>
                        
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full pt-4 relative z-10">
                            <Button onClick={() => router.push('/pages/signin')} className="w-full bg-appNav hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-lg">
                                Proceed to Login
                            </Button>
                        </motion.div>
                    </div>
                )}

                {/* --- ERROR STATE --- */}
                {status === 'error' && (
                    <div className="flex flex-col items-center justify-center space-y-6">
                        {/* Glowing Background for Error */}
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/20 blur-[60px] rounded-full pointer-events-none"
                        />
                        
                        <motion.div variants={iconVariants} className="relative z-10 bg-red-500/20 rounded-full p-4 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                            <IoCloseCircle className="text-6xl text-red-400" />
                        </motion.div>
                        
                        <div className="relative z-10 space-y-2">
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Verification Failed</h2>
                            <p className="text-gray-300 font-medium">{errorMessage}</p>
                        </div>
                        
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full pt-4 relative z-10 flex gap-3">
                            <Button onClick={() => router.push('/pages/home')} className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold transition-all backdrop-blur-sm">
                                Go Home
                            </Button>
                            <Button onClick={() => router.push('/pages/signin')} className="w-full bg-appNav hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg">
                                Login Anyway
                            </Button>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

// --- MAIN PAGE WRAPPER ---
// Next.js requires useSearchParams to be wrapped in a Suspense boundary
export default function VerifyPage() {
    return (
        <div 
            className="min-h-screen w-full flex flex-col items-center justify-center bg-black/80 bg-blend-overlay p-4 sm:p-6 relative overflow-hidden"
            style={{ backgroundImage: "url('/images/shipping.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
            {/* Logo at the top */}
            <div className="absolute top-8 md:top-12 z-20">
                <Image src="/images/logo5.svg" alt="BulQ Logo" width={180} height={45} className="w-32 md:w-48 h-auto drop-shadow-lg" />
            </div>

            <Suspense fallback={
                <div className="flex items-center justify-center space-x-2 text-white z-10">
                    <CgSpinnerTwo className="animate-spin text-4xl text-blue-500" />
                    <span className="font-bold text-xl drop-shadow-md">Loading Secure Environment...</span>
                </div>
            }>
                <VerificationContent />
            </Suspense>

            {/* Cinematic overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-[#0F172A]/80 pointer-events-none" />
        </div>
    );
}