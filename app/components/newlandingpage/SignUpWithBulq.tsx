import React from 'react';
import { IoArrowForward } from "react-icons/io5";

const SignUpWithBulq = () => {
    return (
        <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* Main Card Container */}
                <div className="relative rounded-3xl overflow-hidden bg-appNav shadow-2xl">
                    
                    {/* Background Decorative Blobs (Glow Effects) */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 opacity-20 blur-3xl mix-blend-screen"></div>
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-500 opacity-20 blur-3xl mix-blend-screen"></div>
                    </div>

                    <div className="relative z-10 px-6 py-16 md:py-20 md:px-12 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
                        
                        {/* Text Content */}
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                                Ready to start <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                                    shopping globally?
                                </span>
                            </h2>
                            <p className="text-lg md:text-xl text-blue-100 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Create your free account today and get instant access to your own international shipping address.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-appNav bg-white rounded-xl shadow-lg hover:bg-gray-50 hover:shadow-white/20 transition-all duration-300 transform hover:-translate-y-1">
                                Get Started
                                <IoArrowForward className="ml-2 text-xl group-hover:translate-x-1 transition-transform" />
                            </button>
                            
                            <button className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border-2 border-white/20 rounded-xl hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default SignUpWithBulq;