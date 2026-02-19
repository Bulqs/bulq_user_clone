"use client"
import Link from "next/link";
import React, { useState } from "react";
import Image from 'next/image';
import logo from '../../../public/images/logo5.svg';
import DriverRegistration from './DriverRegistration';
import BusinessRegistration from "./BusinessRegistration";
import DriverLogin from "./DriverLogin";

const Header: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
    const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<"driver" | "business" | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleApplyNowClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const handleLoginClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoginModalOpen(true);
    };

    const handleOptionSelect = (option: "driver" | "business") => {
        setSelectedOption(option);
    };

    const handleContinue = () => {
        if (selectedOption === "driver") {
            setIsModalOpen(false);
            setIsDriverModalOpen(true);
        } else if (selectedOption === "business") {
            setIsModalOpen(false);
            setIsBusinessModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOption(null);
    };

    const closeDriverModal = () => {
        setIsDriverModalOpen(false);
    };

    const closeBusinessModal = () => {
        setIsBusinessModalOpen(false);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="w-full bg-appNav shadow-lg relative">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image
                                src={logo}
                                alt="Company Logo"
                                className="w-28 md:w-48 transition-transform hover:scale-105"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center space-x-10">
                        <Link
                            href="/"
                            className="text-white hover:text-white transition-all duration-300 font-medium relative group py-2"
                        >
                            Home
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link
                            href="/jobs"
                            className="text-white hover:text-white transition-all duration-300 font-medium relative group py-2"
                        >
                            Apply for Jobs
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link
                            href="/about"
                            className="text-white hover:text-white transition-all duration-300 font-medium relative group py-2"
                        >
                            About Us
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link
                            href="/contact"
                            className="text-white hover:text-white transition-all duration-300 font-medium relative group py-2"
                        >
                            Contact
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </nav>

                    {/* Desktop Action Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <button
                            onClick={handleLoginClick}
                            className="px-6 py-2.5 border-2 border-appTitleBgColor text-white rounded-lg hover:bg-appTitleBgColor/10 transition-all duration-300 font-medium hover:scale-105"
                        >
                            Log In
                        </button>
                        <button
                            onClick={handleApplyNowClick}
                            className="px-6 py-2.5 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Apply Now
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden text-white p-2 rounded-lg hover:bg-appTitleBgColor/20 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 w-full bg-appNav shadow-xl border-t border-appTitleBgColor/30 z-40">
                        <div className="container mx-auto px-4 py-6">
                            <nav className="flex flex-col space-y-4">
                                <Link
                                    href="/"
                                    className="text-white hover:text-white py-3 px-4 rounded-lg hover:bg-appTitleBgColor/20 transition-all duration-300 font-medium border-l-4 border-transparent hover:border-white"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/jobs"
                                    className="text-white hover:text-white py-3 px-4 rounded-lg hover:bg-appTitleBgColor/20 transition-all duration-300 font-medium border-l-4 border-transparent hover:border-white"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Apply for Jobs
                                </Link>
                                <Link
                                    href="/about"
                                    className="text-white hover:text-white py-3 px-4 rounded-lg hover:bg-appTitleBgColor/20 transition-all duration-300 font-medium border-l-4 border-transparent hover:border-white"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    About Us
                                </Link>
                                <Link
                                    href="/contact"
                                    className="text-white hover:text-white py-3 px-4 rounded-lg hover:bg-appTitleBgColor/20 transition-all duration-300 font-medium border-l-4 border-transparent hover:border-white"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Contact
                                </Link>
                            </nav>

                            <div className="flex flex-col space-y-3 mt-6 pt-6 border-t border-appTitleBgColor/30">
                                <button
                                    onClick={(e) => {
                                        handleLoginClick(e);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full py-3 px-4 border-2 border-appTitleBgColor text-white rounded-lg hover:bg-appTitleBgColor/10 transition-all duration-300 font-medium text-center"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={(e) => {
                                        handleApplyNowClick(e);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full py-3 px-4 bg-appTitleBgColor text-white rounded-lg hover:bg-appBanner transition-all duration-300 font-medium text-center shadow-lg"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Application Type Selection Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-appTitleBgColor to-appNav rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-95">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-white">Join Our Platform</h3>
                            <button
                                onClick={closeModal}
                                className="text-white hover:text-gray-300 p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Options */}
                        <div className="space-y-3 mb-6">
                            {/* Driver Option */}
                            <div
                                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${selectedOption === "driver"
                                        ? "border-white bg-white/10 shadow-lg"
                                        : "border-white/20 hover:border-white/40 bg-white/5"
                                    }`}
                                onClick={() => handleOptionSelect("driver")}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === "driver" ? "border-white bg-white" : "border-white"
                                        }`}>
                                        {selectedOption === "driver" && (
                                            <div className="w-2 h-2 rounded-full bg-appTitleBgColor"></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-white">Driver</h4>
                                        <p className="text-white/70 text-sm mt-1">
                                            Become a driver and start earning.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Business Option */}
                            <div
                                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${selectedOption === "business"
                                        ? "border-white bg-white/10 shadow-lg"
                                        : "border-white/20 hover:border-white/40 bg-white/5"
                                    }`}
                                onClick={() => handleOptionSelect("business")}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === "business" ? "border-white bg-white" : "border-white"
                                        }`}>
                                        {selectedOption === "business" && (
                                            <div className="w-2 h-2 rounded-full bg-appTitleBgColor"></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-white">Business</h4>
                                        <p className="text-white/70 text-sm mt-1">
                                            Register your business account.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Continue Button */}
                        <button
                            onClick={handleContinue}
                            disabled={!selectedOption}
                            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${selectedOption
                                    ? "bg-white text-appTitleBgColor hover:bg-gray-100 shadow-lg"
                                    : "bg-white/20 text-white/50 cursor-not-allowed"
                                }`}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
            {/* Driver Registration Modal */}
            {isDriverModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-appTitleBgColor rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
                        <div className="flex justify-end p-4 sticky top-0 bg-appTitleBgColor z-10">
                            <button
                                onClick={closeDriverModal}
                                className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <DriverRegistration />
                    </div>
                </div>
            )}

            {/* Business Registration Modal */}
            {isBusinessModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-appTitleBgColor rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
                        <div className="flex justify-end p-4 sticky top-0 bg-appTitleBgColor z-10">
                            <button
                                onClick={closeBusinessModal}
                                className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <BusinessRegistration />
                    </div>
                </div>
            )}

            {/* Login Modal */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-appTitleBgColor rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
                        <div className="flex justify-end p-4 sticky top-0 bg-appTitleBgColor z-10">
                            <button
                                onClick={closeLoginModal}
                                className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <DriverLogin />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;