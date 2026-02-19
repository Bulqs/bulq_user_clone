import React from 'react'
import { FaEnvelope } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

const HowITWorks: React.FC = () => {
    const steps = [
        {
            icon: <FaEnvelope className="text-3xl" />,
            title: "Sign Up / Login",
            description: "Register to view and accept job opportunities",
            step: "01"
        },
        {
            icon: <TbWorld className="text-3xl" />,
            title: "Browse & Accept Jobs",
            description: "Find available jobs by location, type or payment",
            step: "02"
        },
        {
            icon: <IoCheckmarkDoneSharp className="text-3xl" />,
            title: "Connect & Earn",
            description: "Complete the job and track your earnings",
            step: "03"
        }
    ];

    return (
        <div className="w-full bg-gray-50 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-appNav mb-4">How It Works</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Simple steps to start earning with our platform. Get started today and join thousands of successful drivers.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-appNav/20 -z-10"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                {/* Step Card */}
                                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center group hover:-translate-y-2">
                                    {/* Step Number */}
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="w-12 h-12 bg-appNav text-white rounded-full flex items-center justify-center font-bold text-lg border-4 border-white shadow-lg">
                                            {step.step}
                                        </div>
                                    </div>

                                    {/* Icon Container */}
                                    <div className="w-20 h-20 bg-appNav/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-appNav/20 transition-colors duration-300">
                                        {step.icon}
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-appNav mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {step.description}
                                    </p>

                                    {/* Progress Arrow - Hidden on mobile */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:flex items-center justify-center mt-4">
                                            <FaArrowAltCircleRight className="text-appNav text-2xl opacity-60" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Progress Indicators */}
                    <div className="flex justify-center mt-8 lg:hidden">
                        <div className="flex space-x-2">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-appNav' : 'bg-appNav/30'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mt-12">
                    <button className="bg-appNav text-white px-8 py-4 rounded-xl font-semibold hover:bg-appNav/90 transition-colors duration-300 shadow-lg hover:shadow-xl">
                        Get Started Today
                    </button>
                    <p className="text-gray-500 mt-4 text-sm">
                        Join thousands of drivers already earning with our platform
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HowITWorks;