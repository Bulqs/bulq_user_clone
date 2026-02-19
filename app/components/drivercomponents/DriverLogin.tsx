// "use client"
// import Link from 'next/link';
// import React from 'react';
// import { FaGoogle, FaFacebook, FaUser, FaEnvelope, FaLock, FaCheck, FaUserAlt } from 'react-icons/fa';

// const DriverLogin: React.FC = () => {
//     const [formData, setFormData] = React.useState({
//         name: '',
//         username: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         agreeToTerms: false,
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value,
//         }));
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         console.log(formData);
//     };

//     return (
//         <div className="max-h-screen bg-appNav flex">
//             {/* Left Section - Form */}
//             <div className="flex-1 flex flex-col justify-center py-4 px-4 sm:px-6 lg:px-4 xl:px-4">
//                 <div className="mx-auto w-full max-w-md lg:max-w-lg xl:max-w-xl">
//                     <div className="text-center mb-4">
//                         <h1 className="text-2xl font-extrabold text-white mb-2">
//                             Welcome Back, Drive and Earn
//                         </h1>
//                         <p className="text-gray-300 text-sm">
//                             Sign in to your driver account to continue
//                         </p>
//                     </div>

//                     <div className="bg-appTitleBgColor py-4 px-6 shadow-xl sm:rounded-2xl sm:px-8">
//                         <form className="space-y-6" onSubmit={handleSubmit}>
//                             <div>
//                                 <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
//                                     Email/Username
//                                 </label>
//                                 <div className="relative rounded-lg shadow-sm">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <FaUserAlt className="h-5 w-5 text-gray-400" />
//                                     </div>
//                                     <input
//                                         id="email"
//                                         name="email"
//                                         type="email"
//                                         required
//                                         value={formData.email}
//                                         onChange={handleChange}
//                                         placeholder="Enter your email or username"
//                                         className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
//                                     />
//                                 </div>
//                             </div>

//                             <div>
//                                 <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
//                                     Password
//                                 </label>
//                                 <div className="relative rounded-lg shadow-sm">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <FaLock className="h-5 w-5 text-gray-400" />
//                                     </div>
//                                     <input
//                                         id="password"
//                                         name="password"
//                                         type="password"
//                                         required
//                                         value={formData.password}
//                                         onChange={handleChange}
//                                         placeholder="Enter your password"
//                                         className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center">
//                                     <input
//                                         id="agreeToTerms"
//                                         name="agreeToTerms"
//                                         type="checkbox"
//                                         required
//                                         checked={formData.agreeToTerms}
//                                         onChange={handleChange}
//                                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                                     />
//                                     <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-300">
//                                         Remember me
//                                     </label>
//                                 </div>
//                                 <a href="#" className="text-sm text-white hover:text-gray-300 transition-colors">
//                                     Forgot password?
//                                 </a>
//                             </div>

//                             <div>
//                                 <Link
//                                     href="/pages/driver/driverdashboard/dashboard"
//                                     className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-appNav hover:bg-appNav/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                                 >
//                                     Sign In
//                                 </Link>
//                             </div>
//                         </form>

//                         <div className="mt-8">
//                             <div className="relative">
//                                 <div className="absolute inset-0 flex items-center">
//                                     <div className="w-full border-t border-gray-300" />
//                                 </div>
//                                 <div className="relative flex justify-center text-sm">
//                                     <span className="px-3 bg-appTitleBgColor text-white">or continue with</span>
//                                 </div>
//                             </div>

//                             <div className="mt-4 grid grid-cols-2 gap-4">
//                                 <button
//                                     type="button"
//                                     className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//                                 >
//                                     <FaGoogle className="h-5 w-5 text-red-600" />
//                                     <span className="ml-2">Google</span>
//                                 </button>

//                                 <button
//                                     type="button"
//                                     className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
//                                 >
//                                     <FaFacebook className="h-5 w-5 text-blue-600" />
//                                     <span className="ml-2">Facebook</span>
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="mt-4 text-center">
//                             <p className="text-sm text-gray-300">
//                                 Don't have an account?{' '}
//                                 <a href="#" className="font-medium text-white hover:text-gray-300 transition-colors">
//                                     Sign up
//                                 </a>
//                             </p>
//                         </div>
//                     </div>

//                     <div className="mt-4 text-center">
//                         <p className="text-xs text-gray-400">
//                             By signing in, you agree to bulq's{' '}
//                             <a href="#" className="text-white hover:text-gray-300 transition-colors">
//                                 Terms of Service
//                             </a>
//                             ,{' '}
//                             <a href="#" className="text-white hover:text-gray-300 transition-colors">
//                                 Privacy Policy
//                             </a>{' '}
//                             and default{' '}
//                             <a href="#" className="text-white hover:text-gray-300 transition-colors">
//                                 Notification Settings
//                             </a>
//                         </p>
//                     </div>
//                 </div>
//             </div>

//             {/* Right Section - Image */}
//             <div className="hidden lg:block flex-1 relative">
//                 <div
//                     className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//                     style={{
//                         backgroundImage: 'url("/images/driverloginimg.png")'
//                     }}
//                 >
//                     {/* Overlay for better text readability */}
//                     <div className="absolute inset-0 bg-black/20"></div>

//                     {/* Content on image */}
//                     <div className="relative z-10 flex flex-col justify-center h-full px-16">
//                         <div className="max-w-md">
//                             <h2 className="text-4xl font-bold text-white mb-4">
//                                 Drive With Confidence
//                             </h2>
//                             <p className="text-xl text-gray-200 mb-6">
//                                 Join thousands of drivers earning on their own schedule with bulq logistics.
//                             </p>
//                             <div className="space-y-3">
//                                 <div className="flex items-center text-white">
//                                     <FaCheck className="h-5 w-5 text-green-400 mr-3" />
//                                     <span>Flexible working hours</span>
//                                 </div>
//                                 <div className="flex items-center text-white">
//                                     <FaCheck className="h-5 w-5 text-green-400 mr-3" />
//                                     <span>Competitive earnings</span>
//                                 </div>
//                                 <div className="flex items-center text-white">
//                                     <FaCheck className="h-5 w-5 text-green-400 mr-3" />
//                                     <span>24/7 support</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DriverLogin;




"use client"
import Link from 'next/link';
import React from 'react';
import { FaGoogle, FaFacebook, FaUser, FaEnvelope, FaLock, FaCheck, FaUserAlt } from 'react-icons/fa';

const DriverLogin: React.FC = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="max-h-screen bg-appNav flex">
            {/* Left Section - Form */}
            <div className="flex-1 flex flex-col justify-center py-4 px-4 sm:px-6 lg:px-4 xl:px-4">
                <div className="mx-auto w-full max-w-md lg:max-w-lg xl:max-w-xl">
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-extrabold text-white mb-2">
                            Welcome Back, Drive and Earn
                        </h1>
                        <p className="text-gray-300 text-sm">
                            Sign in to your driver account to continue
                        </p>
                    </div>

                    <div className="bg-appTitleBgColor py-4 px-6 shadow-xl sm:rounded-2xl sm:px-8">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                    Email/Username
                                </label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUserAlt className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email or username"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                    Password
                                </label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        type="checkbox"
                                        required
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-300">
                                        Remember me
                                    </label>
                                </div>
                                <a href="#" className="text-sm text-white hover:text-gray-300 transition-colors">
                                    Forgot password?
                                </a>
                            </div>

                            <div>
                                <Link
                                    href="/pages/driver/driverdashboard/dashboard"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-appNav hover:bg-appNav/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-3 bg-appTitleBgColor text-white">or continue with</span>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <FaGoogle className="h-5 w-5 text-red-600" />
                                    <span className="ml-2">Google</span>
                                </button>

                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <FaFacebook className="h-5 w-5 text-blue-600" />
                                    <span className="ml-2">Facebook</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-300">
                                Don't have an account?{' '}
                                <a href="#" className="font-medium text-white hover:text-gray-300 transition-colors">
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400">
                            By signing in, you agree to bulq's{' '}
                            <a href="#" className="text-white hover:text-gray-300 transition-colors">
                                Terms of Service
                            </a>
                            ,{' '}
                            <a href="#" className="text-white hover:text-gray-300 transition-colors">
                                Privacy Policy
                            </a>{' '}
                            and default{' '}
                            <a href="#" className="text-white hover:text-gray-300 transition-colors">
                                Notification Settings
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section - Image with Gradient Overlay */}
            <div className="hidden lg:block flex-1 relative">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url("/images/driverloginimg.png")'
                    }}
                >
                    {/* Gradient Overlay - #000000 at 0% to #05674B at bottom */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, #05674B 100%)'
                        }}
                    ></div>

                    {/* Content on image */}
                    <div className="relative z-10 flex flex-col justify-end h-full pb-16 px-16">
                        <div className="max-w-md">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                Drive With Confidence
                            </h2>
                            <p className="text-xl text-gray-200 mb-6">
                                Join thousands of drivers earning on their own schedule with bulq logistics.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center text-white">
                                    <FaCheck className="h-5 w-5 text-green-400 mr-3" />
                                    <span>Flexible working hours</span>
                                </div>
                                <div className="flex items-center text-white">
                                    <FaCheck className="h-5 w-5 text-green-400 mr-3" />
                                    <span>Competitive earnings</span>
                                </div>
                                <div className="flex items-center text-white">
                                    <FaCheck className="h-5 w-5 text-green-400 mr-3" />
                                    <span>24/7 support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverLogin;