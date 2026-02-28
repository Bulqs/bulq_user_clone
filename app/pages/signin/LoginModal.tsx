"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';

// Logic Imports
import { NAVIGATION, User, USER_AUTHORITES, UserAside } from '@/types/user';
import { LoginUser } from '@/lib/actions';
import { useUserStore } from '@/lib/utils/store';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
}

// --- ANIMATION VARIANTS ---
const avatarContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
};

const avatarItem: Variants = {
    hidden: { opacity: 0, scale: 0.5, x: -20 },
    show: { opacity: 1, scale: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 15 } }
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
    const router = useRouter();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [submissionPending, setSubmissionPending] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            useUserStore.persist.rehydrate();
        }
    }, [isOpen]);

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8084/oauth2/authorization/google";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmissionPending(true);
        setErrorMessage("");

        try {
            const user: User = await LoginUser(formData);
            if (user) {
                const authorities = user.authorities[0]?.authority.split(" ");
                const userAside: UserAside = {
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    email: user?.email,
                    image: user?.image
                };
                useUserStore.getState().addUserInfo(userAside);

                onClose(); 
                if (authorities.includes(USER_AUTHORITES.ADMIN)) router.push(NAVIGATION.ADMIN);
                else if (authorities.includes(USER_AUTHORITES.VENDOR)) router.push(NAVIGATION.VENDOR);
                else if (authorities.includes(USER_AUTHORITES.USER)) router.push(NAVIGATION.HOMELOGGEDIN);
            }
        } catch (error) {
            setErrorMessage("Error validating credentials!");
        } finally {
            setSubmissionPending(false);
        }
    };

    if (!isOpen) return null;

    return (
        // OVERLAY: Fades in smoothly
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8"
        >
            {/* MODAL CONTAINER: Springs up and scales in */}
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative flex w-full max-w-5xl h-[90vh] md:h-[80vh] bg-white rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
                {/* CLOSE BUTTON */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-gray-600 hover:bg-red-500 hover:text-white transition-all duration-300 backdrop-blur-sm"
                >
                    ✕
                </button>

                {/* LEFT SECTION: Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto custom-scrollbar relative z-10">
                    <div className="max-w-md mx-auto w-full">
                        
                        <div className="mb-10 text-center md:text-left">
                            <Image src="/images/logo5.svg" alt="BulQ Logo" width={140} height={40} className="mb-8 mx-auto md:mx-0 drop-shadow-sm" />
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Welcome Back!</h1>
                            <p className="text-gray-500 font-medium">Sign in to access your dashboard and manage your shipments.</p>
                        </div>

                        {errorMessage && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium text-center"
                            >
                                {errorMessage}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 font-medium shadow-sm"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
                                    <Link href="/pages/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors">Forgot Password?</Link>
                                </div>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 font-medium shadow-sm"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submissionPending}
                                className="group relative w-full overflow-hidden bg-appTitleBgColor py-4 rounded-xl shadow-lg hover:shadow-blue-900/20 transition-all duration-300 active:scale-[0.98] mt-4 disabled:bg-gray-400 disabled:active:scale-100"
                            >
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                <span className="relative z-10 text-white font-bold text-lg tracking-wide">
                                    {submissionPending ? "Verifying..." : "Sign In"}
                                </span>
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-widest">Or</span></div>
                        </div>

                        <button 
                            type="button"
                            className="w-full bg-white border-2 border-gray-100 text-gray-700 py-4 px-4 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm flex items-center justify-center active:scale-[0.98]" 
                            onClick={handleGoogleLogin}
                        >
                            <Image src="/images/gmaillogo.png" alt="Google" width={22} height={22} className="mr-3" />
                            Continue With Google
                        </button>

                        <div className="mt-10 text-center text-gray-500 font-medium">
                            Don't have an account?{' '}
                            <button 
                                type="button"
                                onClick={onSwitchToRegister} 
                                className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
                            >
                                Create one now
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION: Branding & Reviews (Hidden on mobile) */}
                <div className="hidden md:flex w-1/2 relative bg-black overflow-hidden border-l border-gray-100">
                    
                    {/* Slow Breathing Background Image */}
                    <motion.div 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-[url('/images/airplane.png')] bg-cover bg-center opacity-60"
                    />
                    
                    {/* Rich Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-appTitleBgColor via-appTitleBgColor/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-appNav/30 to-transparent mix-blend-overlay"></div>
                    
                    <div className="relative z-10 h-full flex flex-col justify-end p-10 lg:p-16 text-white pb-20">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="max-w-md"
                        >
                            <h2 className="text-4xl lg:text-5xl font-extrabold mb-3 tracking-tight text-white drop-shadow-lg">Global Shipping,</h2>
                            <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-blue-400 drop-shadow-md">Simplified.</h3>
                            <p className="text-lg text-gray-300 mb-12 leading-relaxed font-medium">
                                Join our network and experience the most reliable logistics platform for your international shopping.
                            </p>

                            {/* STAGGERED REVIEWS & AVATARS */}
                            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-5 mt-auto">
                                <motion.div 
                                    variants={avatarContainer}
                                    initial="hidden"
                                    animate="show"
                                    className="flex -space-x-4"
                                >
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <motion.div variants={avatarItem} key={item} className="w-14 h-14 rounded-full border-2 border-appTitleBgColor bg-gray-800 overflow-hidden shadow-xl relative z-10 hover:z-20 hover:scale-110 transition-transform cursor-pointer">
                                            <Image src={`https://i.pravatar.cc/150?u=${item}`} alt="user" width={56} height={56} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                                <div className="flex flex-col">
                                    <div className="flex gap-1 text-yellow-400 drop-shadow-md">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        ))}
                                    </div>
                                    <p className="text-sm font-bold text-gray-300 mt-2">Trusted by 50,000+ users</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default LoginModal;