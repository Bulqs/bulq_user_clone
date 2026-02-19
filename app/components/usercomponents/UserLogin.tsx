
// "use client";
// import React, { useEffect, useCallback, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import UserSignUp from './UserSignUp';

// interface UserLoginProps {
//     isModal?: boolean;
//     onClose?: () => void;
// }

// const UserLogin: React.FC<UserLoginProps> = ({ isModal = false, onClose = () => { } }) => {
//     const [showSignUp, setShowSignUp] = useState(false);

//     useEffect(() => {
//         if (isModal) {
//             document.body.classList.add('modal-open');
//             document.body.style.touchAction = 'none';
//             return () => {
//                 document.body.classList.remove('modal-open');
//                 document.body.style.touchAction = '';
//             };
//         }
//     }, [isModal]);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         // Handle form submission logic
//     };

//     const handleClose = useCallback((e: React.MouseEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         onClose();
//         const dummy = document.body.offsetHeight;
//     }, [onClose]);

//     if (!isModal) return null;

//     if (showSignUp) {
//         return <UserSignUp isModal={isModal} onClose={onClose} onSwitchToLogin={() => setShowSignUp(false)} />;
//     }

//     return (
//         <div
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[500]"
//             onClick={handleClose}
//             data-testid="modal-overlay"
//         >
//             <div
//                 className="relative bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
//                 onClick={(e) => e.stopPropagation()}
//                 role="dialog"
//                 aria-modal="true"
//                 tabIndex={-1}
//             >
//                 <button
//                     onClick={handleClose}
//                     className="absolute top-4 right-4 text-white p-1 rounded-md bg-red-900 hover:text-gray-700 z-[1000]"
//                     aria-label="Close modal"
//                 >
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-6 w-6"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                     >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                 </button>
//                 <div className="min-h-[80vh] flex flex-col md:flex-row">
//                     <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 bg-white flex flex-col justify-center">
//                         <div className="max-w-md mx-auto w-full">
//                             <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
//                             <p className="text-gray-600 mb-8">Sign in to access your dashboard and continue shipping</p>

//                             <form onSubmit={handleSubmit} className="space-y-6">
//                                 <div>
//                                     <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Email Address
//                                     </label>
//                                     <input
//                                         type="email"
//                                         id="email"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                         placeholder="Enter your email"
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Password
//                                     </label>
//                                     <input
//                                         type="password"
//                                         id="password"
//                                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
//                                         placeholder="Enter your password"
//                                         required
//                                     />
//                                     <div className="mt-2 text-right">
//                                         <Link href="#" className="text-sm text-blue-600 hover:underline">
//                                             Forgot Password?
//                                         </Link>
//                                     </div>
//                                 </div>

//                                 <button
//                                     type="submit"
//                                     className="w-full bg-appTitleBgColor text-white py-3 px-4 rounded-lg font-medium hover:bg-appNav transition-colors"
//                                 >
//                                     Sign In
//                                 </button>
//                             </form>
//                             <div className="relative my-6">
//                                 <div className="absolute inset-0 flex items-center">
//                                     <div className="w-full border-t border-gray-300"></div>
//                                 </div>
//                                 <div className="relative flex justify-center text-sm">
//                                     <span className="px-2 bg-white text-gray-500">OR</span>
//                                 </div>
//                             </div>

//                             <button
//                                 type="button"
//                                 className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
//                             >
//                                 <Image
//                                     src="/images/gmaillogo.png"
//                                     alt="Google"
//                                     width={20}
//                                     height={20}
//                                     className="mr-2"
//                                 />
//                                 Continue With Google
//                             </button>


//                             <div className="mt-6 text-center text-sm text-gray-600">
//                                 Don't have an Account?{' '}
//                                 <button
//                                     onClick={(e) => {
//                                         e.preventDefault();
//                                         setShowSignUp(true);
//                                     }}
//                                     className="text-blue-600 hover:underline"
//                                 >
//                                     Sign Up
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right section remains the same */}
//                     <div className="w-full md:w-1/2 bg-gray-100 relative">
//                         <div className="absolute inset-0 bg-[url('/images/airplane.png')] bg-cover bg-center opacity-90"></div>
//                         <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12 lg:p-20 bg-black bg-opacity-40 text-white">
//                             <div className="max-w-md mx-auto">
//                                 <h2 className="text-5xl font-bold mb-4">Welcome Back</h2>
//                                 <h3 className="text-4xl font-bold mb-6">Famclient</h3>
//                                 <p className="text-lg mb-8">
//                                     Join our community and experience the best platform for your needs.
//                                     We'll send you a verification email to activate your account.
//                                 </p>
//                                 <div className="flex items-center mt-12">
//                                     <div className="flex -space-x-2">
//                                         {[1, 2, 3, 4, 5].map((item) => (
//                                             <div
//                                                 key={item}
//                                                 className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white"
//                                             />
//                                         ))}
//                                     </div>
//                                     <div className="ml-4">
//                                         <div className="flex items-center">
//                                             {[...Array(5)].map((_, i) => (
//                                                 <svg
//                                                     key={i}
//                                                     className="w-5 h-5 text-yellow-400"
//                                                     fill="currentColor"
//                                                     viewBox="0 0 20 20"
//                                                 >
//                                                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                                                 </svg>
//                                             ))}
//                                         </div>
//                                         <p className="text-sm mt-1">From 300+ reviews</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div >
//         </div >
//     );
// };

// export default UserLogin;

"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserSignUp from './UserSignUp';

// Import your logic and types
import { NAVIGATION, User, USER_AUTHORITES, UserAside } from '@/types/user';
import { LoginUser } from '@/lib/actions';
import { useUserStore } from '@/lib/utils/store';

const UserLogin: React.FC = () => {
    const [showSignUp, setShowSignUp] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [submissionPending, setSubmissionPending] = useState<boolean>(false);

    useEffect(() => {
        useUserStore.persist.rehydrate();
    }, []);

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

                if (authorities.includes(USER_AUTHORITES.ADMIN)) {
                    router.push(NAVIGATION.ADMIN);
                } else if (authorities.includes(USER_AUTHORITES.VENDOR)) {
                    router.push(NAVIGATION.VENDOR);
                } else if (authorities.includes(USER_AUTHORITES.USER)) {
                    router.push(NAVIGATION.HOMELOGGEDIN);
                }
            }
        } catch (error) {
            setErrorMessage("Error validating credentials!");
        } finally {
            setSubmissionPending(false);
        }
    };

    // FIX: Passing only the allowed prop to UserSignUp
    if (showSignUp) {
        return <UserSignUp onSwitchToLogin={() => setShowSignUp(false)} />;
    }

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 bg-white flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
                    <p className="text-gray-600 mb-8">Sign in to access your dashboard</p>

                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submissionPending}
                            className="w-full bg-appTitleBgColor text-white py-3 px-4 rounded-lg font-medium hover:bg-appNav transition-colors disabled:bg-gray-400"
                        >
                            {submissionPending ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an Account?{' '}
                        <button
                            onClick={() => setShowSignUp(true)}
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-1/2 bg-gray-100 relative min-h-[400px]">
                <div className="absolute inset-0 bg-[url('/images/airplane.png')] bg-cover bg-center"></div>
                <div className="relative z-10 h-full flex flex-col justify-center p-12 bg-black/40 text-white">
                    <h2 className="text-5xl font-bold mb-4">Welcome Back</h2>
                    <p className="text-lg">Access the best logistics platform for your shipping needs.</p>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;