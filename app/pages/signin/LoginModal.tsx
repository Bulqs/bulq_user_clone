"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Logic Imports
import { NAVIGATION, User, USER_AUTHORITES, UserAside } from '@/types/user';
import { LoginUser } from '@/lib/actions';
import { useUserStore } from '@/lib/utils/store';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void; // Used to swap to the Register modal
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
    const router = useRouter();

    // State for Login Form
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [submissionPending, setSubmissionPending] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            useUserStore.persist.rehydrate();
        }
    }, [isOpen]);

    const handleGoogleLogin = () => {
        // If your backend handles the redirect:
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

                // Role-based Redirects
                onClose(); // Close the modal before redirecting
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

    // If modal is not open, render nothing
    if (!isOpen) return null;

    return (
        // OVERLAY: The dark background behind the modal
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
            
            {/* MODAL CONTAINER */}
            <div className="relative flex w-full max-w-5xl max-h-[95vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
                
                {/* CLOSE BUTTON */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-black hover:bg-black/80 hover:text-white transition-all"
                >
                    ✕
                </button>

                {/* LEFT SECTION: Login Form (Scrollable) */}
                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center overflow-y-auto custom-scrollbar">
                    <div className="max-w-md mx-auto w-full">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
                        <p className="text-gray-600 mb-8">Sign in to access your dashboard and continue shipping</p>

                        {errorMessage && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition text-black"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition text-black"
                                    placeholder="Enter your password"
                                    required
                                />
                                <div className="mt-2 text-right">
                                    <Link href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submissionPending}
                                className="w-full bg-appTitleBgColor text-white py-3 px-4 rounded-lg font-medium hover:bg-appNav transition-all disabled:bg-gray-400"
                            >
                                {submissionPending ? "Verifying..." : "Sign In"}
                            </button>
                        </form>

                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">OR</span></div>
                        </div>

                        <button 
                            type="button"
                            className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center" 
                            onClick={handleGoogleLogin}
                        >
                            <Image src="/images/gmaillogo.png" alt="Google" width={20} height={20} className="mr-2" />
                            Continue With Google
                        </button>

                        <div className="mt-8 text-center text-sm text-gray-600">
                            Don't have an Account?{' '}
                            <button 
                                type="button"
                                onClick={onSwitchToRegister} 
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION: Branding & Reviews (Hidden on small screens) */}
                <div className="hidden md:flex w-1/2 bg-gray-900 relative">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 bg-[url('/images/airplane.png')] bg-cover bg-center opacity-70"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    
                    <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-16 text-white">
                        <div className="max-w-md">
                            <h2 className="text-5xl font-extrabold mb-2 tracking-tight">Welcome Back</h2>
                            <h3 className="text-4xl font-bold mb-6 text-blue-400">BulQ Logistics</h3>
                            <p className="text-lg text-gray-200 mb-10 leading-relaxed">
                                Join our community and experience the best platform for your global shipping needs.
                            </p>

                            {/* REVIEWS & AVATARS SECTION */}
                            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 mt-10">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <div key={item} className="w-12 h-12 rounded-full border-2 border-white bg-gray-400 overflow-hidden shadow-lg">
                                            <Image src={`https://i.pravatar.cc/150?u=${item}`} alt="user" width={48} height={48} />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        ))}
                                    </div>
                                    <p className="text-sm font-medium text-gray-300 mt-1">From 300+ verified reviews</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;