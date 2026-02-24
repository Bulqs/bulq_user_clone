"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Logic Imports
import { NAVIGATION, User, USER_AUTHORITES, UserAside } from '@/types/user';
import { LoginUser } from '@/lib/actions';
import { useUserStore } from '@/lib/utils/store';

// --- Framer Motion Variants ---
const pageTransition: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3, ease: "easeIn" } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const slideInRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const UserLogin: React.FC = () => {
    const router = useRouter();

    // State for Login Form
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [submissionPending, setSubmissionPending] = useState<boolean>(false);

    useEffect(() => {
        useUserStore.persist.rehydrate();
    }, []);

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

    return (
        <motion.div 
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden"
        >
            {/* LEFT SECTION: Login Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 bg-white flex flex-col justify-center relative z-10">
                <motion.div 
                    className="max-w-md mx-auto w-full"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                >
                    <motion.h1 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        Welcome Back!
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-gray-500 mb-8">
                        Sign in to access your dashboard and continue shipping
                    </motion.p>

                    <AnimatePresence>
                        {errorMessage && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm overflow-hidden"
                            >
                                {errorMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div variants={fadeUp}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-appTitleBgColor/20 focus:border-appTitleBgColor transition-all bg-gray-50 focus:bg-white"
                                placeholder="Enter your email"
                                required
                            />
                        </motion.div>

                        <motion.div variants={fadeUp}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-appTitleBgColor/20 focus:border-appTitleBgColor transition-all bg-gray-50 focus:bg-white"
                                placeholder="Enter your password"
                                required
                            />
                            <div className="mt-2 text-right">
                                <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                        </motion.div>

                        <motion.button
                            variants={fadeUp}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={submissionPending}
                            className="w-full bg-appTitleBgColor text-white py-3 px-4 rounded-xl font-bold hover:bg-appNav shadow-lg shadow-appTitleBgColor/20 transition-all disabled:bg-gray-400 disabled:shadow-none flex justify-center items-center h-12"
                        >
                            {submissionPending ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : "Sign In"}
                        </motion.button>
                    </form>

                    <motion.div variants={fadeUp} className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 font-medium tracking-wide">OR</span>
                        </div>
                    </motion.div>

                    <motion.button 
                        variants={fadeUp}
                        whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleLogin}
                        className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center shadow-sm hover:border-gray-300 hover:shadow"
                    >
                        <Image src="/images/gmaillogo.png" alt="Google" width={20} height={20} className="mr-3" />
                        Continue With Google
                    </motion.button>

                    <motion.div variants={fadeUp} className="mt-8 text-center text-sm text-gray-600">
                        Don't have an Account?{' '}
                        {/* CHANGED THIS TO A NEXT.JS LINK */}
                        <Link 
                            href="/pages/signup" 
                            className="text-appTitleBgColor font-bold hover:underline transition-colors ml-1"
                        >
                            Sign Up
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* RIGHT SECTION: Branding & Reviews */}
            <motion.div 
                variants={slideInRight}
                initial="hidden"
                animate="show"
                className="w-full md:w-1/2 bg-gray-900 relative min-h-[400px] hidden md:block"
            >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 bg-[url('/images/airplane.png')] bg-cover bg-center opacity-60 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-16 lg:p-24 text-white">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="max-w-lg"
                    >
                        <h2 className="text-4xl lg:text-5xl font-extrabold mb-3 tracking-tight text-white">Welcome Back</h2>
                        <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-blue-400">BulQ Logistics</h3>
                        <p className="text-base lg:text-lg text-gray-300 mb-10 leading-relaxed font-light">
                            Join our community and experience the best platform for your global shipping needs. Track, manage, and deliver seamlessly.
                        </p>

                        {/* REVIEWS & AVATARS SECTION */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-10 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div key={item} className="w-12 h-12 rounded-full border-2 border-gray-800 overflow-hidden shadow-lg transition-transform hover:-translate-y-1">
                                        <Image src={`https://i.pravatar.cc/150?u=${item}`} alt="user" width={48} height={48} />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-yellow-400 gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                                <p className="text-sm font-medium text-gray-300 mt-1.5">From 300+ verified reviews</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default UserLogin;

// "use client";
// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// // import UserSignUp from './UserSignUp';

// // Logic Imports
// import { NAVIGATION, User, USER_AUTHORITES, UserAside } from '@/types/user';
// import { LoginUser } from '@/lib/actions';
// import { useUserStore } from '@/lib/utils/store';
// import UserSignUp from '@/app/components/usercomponents/UserSignUp';

// const UserLogin: React.FC = () => {
//     const [showSignUp, setShowSignUp] = useState(false);
//     const router = useRouter();

//     // State for Login Form
//     const [formData, setFormData] = useState({ email: '', password: '' });
//     const [errorMessage, setErrorMessage] = useState<string>("");
//     const [submissionPending, setSubmissionPending] = useState<boolean>(false);

//     useEffect(() => {
//         useUserStore.persist.rehydrate();
//     }, []);

//     const handleGoogleLogin = () => {
//     // If your backend handles the redirect:
//     window.location.href = "http://localhost:8084/oauth2/authorization/google";
    
//     // OR, if you use a client-side library like @react-oauth/google:
//     // This would trigger a popup and return a credential we then send to your API.
// };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setSubmissionPending(true);
//         setErrorMessage("");

//         try {
//             const user: User = await LoginUser(formData);
//             if (user) {
//                 const authorities = user.authorities[0]?.authority.split(" ");
//                 const userAside: UserAside = {
//                     firstName: user?.firstName,
//                     lastName: user?.lastName,
//                     email: user?.email,
//                     image: user?.image
//                 };
//                 useUserStore.getState().addUserInfo(userAside);

//                 // Role-based Redirects
//                 if (authorities.includes(USER_AUTHORITES.ADMIN)) router.push(NAVIGATION.ADMIN);
//                 else if (authorities.includes(USER_AUTHORITES.VENDOR)) router.push(NAVIGATION.VENDOR);
//                 else if (authorities.includes(USER_AUTHORITES.USER)) router.push(NAVIGATION.HOMELOGGEDIN);
//             }
//         } catch (error) {
//             setErrorMessage("Error validating credentials!");
//         } finally {
//             setSubmissionPending(false);
//         }
//     };

//     // Toggle to Sign Up Page
//     if (showSignUp) {
//         return <UserSignUp onSwitchToLogin={() => setShowSignUp(false)} />;
//     }

//     return (
//         <div className="min-h-screen bg-white flex flex-col md:flex-row">
//             {/* LEFT SECTION: Login Form */}
//             <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 bg-white flex flex-col justify-center">
//                 <div className="max-w-md mx-auto w-full">
//                     <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
//                     <p className="text-gray-600 mb-8">Sign in to access your dashboard and continue shipping</p>

//                     {errorMessage && (
//                         <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
//                             {errorMessage}
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                             <input
//                                 type="email"
//                                 value={formData.email}
//                                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
//                                 placeholder="Enter your email"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                             <input
//                                 type="password"
//                                 value={formData.password}
//                                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                                 className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
//                                 placeholder="Enter your password"
//                                 required
//                             />
//                             <div className="mt-2 text-right">
//                                 <Link href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
//                             </div>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={submissionPending}
//                             className="w-full bg-appTitleBgColor text-white py-3 px-4 rounded-lg font-medium hover:bg-appNav transition-all disabled:bg-gray-400"
//                         >
//                             {submissionPending ? "Verifying..." : "Sign In"}
//                         </button>
//                     </form>

//                     <div className="relative my-8">
//                         <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
//                         <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">OR</span></div>
//                     </div>

//                     <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center" onClick={handleGoogleLogin}>
//                         <Image src="/images/gmaillogo.png" alt="Google" width={20} height={20} className="mr-2" />
//                         Continue With Google
//                     </button>

//                     <div className="mt-8 text-center text-sm text-gray-600">
//                         Don't have an Account?{' '}
//                         <button onClick={() => setShowSignUp(true)} className="text-blue-600 font-bold hover:underline">
//                             Sign Up
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* RIGHT SECTION: Branding & Reviews */}
//             <div className="w-full md:w-1/2 bg-gray-900 relative min-h-[400px]">
//                 {/* Background Image with Overlay */}
//                 <div className="absolute inset-0 bg-[url('/images/airplane.png')] bg-cover bg-center opacity-70"></div>
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
//                 <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-16 lg:p-24 text-white">
//                     <div className="max-w-md">
//                         <h2 className="text-5xl font-extrabold mb-2 tracking-tight">Welcome Back</h2>
//                         <h3 className="text-4xl font-bold mb-6 text-blue-400">BulQ Logistics</h3>
//                         <p className="text-lg text-gray-200 mb-10 leading-relaxed">
//                             Join our community and experience the best platform for your global shipping needs.
//                         </p>

//                         {/* REVIEWS & AVATARS SECTION */}
//                         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-10">
//                             <div className="flex -space-x-3">
//                                 {[1, 2, 3, 4, 5].map((item) => (
//                                     <div key={item} className="w-12 h-12 rounded-full border-2 border-white bg-gray-400 overflow-hidden shadow-lg">
//                                         <Image src={`https://i.pravatar.cc/150?u=${item}`} alt="user" width={48} height={48} />
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="flex flex-col">
//                                 <div className="flex text-yellow-400">
//                                     {[...Array(5)].map((_, i) => (
//                                         <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
//                                     ))}
//                                 </div>
//                                 <p className="text-sm font-medium text-gray-300 mt-1">From 300+ verified reviews</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UserLogin;
