'use client'

import { useState } from 'react';
import { FaGoogle, FaFacebook, FaUser, FaEnvelope, FaLock, FaCheck, FaBuilding, FaPhone } from 'react-icons/fa';
import Modal from './Modal';
import BusinessProfile from './BusinessProfile';
import BusinessRegSuccess from './BusinessRegSuccess';

interface BusinessRegistrationFormData {
    name: string;
    username: string;
    email: string;
    mobile: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

const BusinessRegistration = () => {
    const [formData, setFormData] = useState<BusinessRegistrationFormData>({
        name: '',
        username: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });

    const [showBusinessModal, setShowBusinessModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        setShowBusinessModal(true);
    };

    const handleBusinessSubmit = (businessData: any) => {
        const completeData = { ...formData, ...businessData };
        console.log('Complete business registration data:', completeData);
        setShowBusinessModal(false);
        setShowSuccessModal(true);
    };

    return (
        <>
            <div className="max-h-screen bg-appNav flex">
                {/* Left Section - Form */}
                <div className="flex-1 flex flex-col justify-center py-4 px-4 sm:px-6 lg:px-4 xl:px-4">
                    <div className="mx-auto w-full max-w-md lg:max-w-lg xl:max-w-xl">
                        <div className="text-center mb-4">
                            <h1 className="text-2xl font-extrabold text-white">
                                Register Your Business
                            </h1>
                            <p className="text-gray-300 text-sm font-semibold">
                                Connect, Drive, and Grow Your Business
                            </p>
                        </div>

                        <div className="bg-appTitleBgColor py-4 px-6 shadow-xl sm:rounded-2xl sm:px-6">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                                            Business Representative Name
                                        </label>
                                        <div className="relative rounded-lg shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaUser className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter representative name"
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                                            Username
                                        </label>
                                        <div className="relative rounded-lg shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaBuilding className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                required
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder="Choose a username"
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                            Business Email
                                        </label>
                                        <div className="relative rounded-lg shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaEnvelope className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter business email"
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="mobile" className="block text-sm font-medium text-white mb-2">
                                            Mobile Number
                                        </label>
                                        <div className="relative rounded-lg shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaPhone className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="mobile"
                                                name="mobile"
                                                type="tel"
                                                required
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                placeholder="Enter mobile number"
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                placeholder="Create a password"
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative rounded-lg shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaCheck className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm your password"
                                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>

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
                                    <label htmlFor="agreeToTerms" className="ml-2 block text-xs text-gray-300">
                                        I agree with bulq's{' '}
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
                                    </label>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-appNav hover:bg-appNav/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Register Business
                                    </button>
                                </div>
                            </form>

                            <div className="mt-2">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-3 bg-appTitleBgColor text-white">or sign up with</span>
                                    </div>
                                </div>

                                <div className="mt-2 grid grid-cols-2 gap-4">
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

                            <div className="mt-2 text-center">
                                <p className="text-sm text-gray-300">
                                    Already have an account?{' '}
                                    <a href="#" className="font-medium text-white hover:text-gray-300 transition-colors">
                                        Sign in
                                    </a>
                                </p>
                            </div>
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
                                    Grow Your Business
                                </h2>
                                <p className="text-xl text-gray-200 mb-6">
                                    Partner with bulq logistics to expand your delivery capabilities and reach more customers.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center text-white">
                                        <FaCheck className="h-5 w-5 text-green-400 mr-3" />
                                        <span>Expand your delivery network</span>
                                    </div>
                                    <div className="flex items-center text-white">
                                        <FaCheck className="h-5 w-5 text-green-400 mr-3" />
                                        <span>Real-time tracking and analytics</span>
                                    </div>
                                    <div className="flex items-center text-white">
                                        <FaCheck className="h-5 w-5 text-green-400 mr-3" />
                                        <span>Dedicated business support</span>
                                    </div>
                                    <div className="flex items-center text-white">
                                        <FaCheck className="h-5 w-5 text-green-400 mr-3" />
                                        <span>Competitive partnership terms</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={showBusinessModal} onClose={() => setShowBusinessModal(false)}>
                <BusinessProfile
                    onSubmit={handleBusinessSubmit}
                    onSuccess={() => {
                        setShowBusinessModal(false);
                        setShowSuccessModal(true);
                    }}
                />
            </Modal>

            <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
                <BusinessRegSuccess onClose={() => setShowSuccessModal(false)} />
            </Modal>
        </>
    );
};

export default BusinessRegistration;