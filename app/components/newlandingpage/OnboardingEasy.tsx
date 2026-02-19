import React from "react";

const OnboardingEasy: React.FC = () => {
    return (
        <section className="w-full min-h-screen relative">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("/images/driverimage.png")'
                }}
            >
                {/* Gradient Overlay - #000000 0% on left to #05674B on right */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to right, rgba(0,0,0,0) 0%, #05674B 60%)'
                    }}
                ></div>
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center">
                <div className="w-full mx-auto px-6 md:px-10 lg:px-20">
                    <div className="max-w-2xl ml-auto">

                        {/* Header */}
                        <p className="text-lg mb-3 text-white/80 font-semibold">How it works</p>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-12 text-white">
                            We make Onboarding easy
                        </h2>

                        {/* Steps Wrapper */}
                        <div className="relative ml-4 space-y-12">

                            {/* Vertical Line */}
                            <div className="absolute top-0 left-4 h-full border-l-2 border-dashed border-white/40" />

                            {/* STEP 1 */}
                            <div className="flex items-start gap-6 relative">
                                <div className="z-10 bg-white text-[#05674B] w-8 h-8 rounded-full flex items-center justify-center font-black text-lg">
                                    ✓
                                </div>

                                <div>
                                    <p className="text-base text-white/80 font-medium">Step 1</p>
                                    <h4 className="font-black text-xl lg:text-2xl mb-3 text-white">
                                        Create Account
                                    </h4>
                                    <p className="text-base text-white/90 leading-relaxed font-medium">
                                        Sign up with your driver credentials and complete your profile to get a vehicle
                                    </p>
                                </div>
                            </div>

                            {/* STEP 2 */}
                            <div className="flex items-start gap-6 relative">
                                <div className="z-10 bg-white text-[#05674B] w-8 h-8 rounded-full flex items-center justify-center font-black text-lg">
                                    ✓
                                </div>

                                <div>
                                    <p className="text-base text-white/80 font-medium">Step 2</p>
                                    <h4 className="font-black text-xl lg:text-2xl mb-3 text-white">
                                        Access Dashboard for Jobs
                                    </h4>
                                    <p className="text-base text-white/90 leading-relaxed font-medium">
                                        Everything you need to manage your logistics operation efficiently
                                    </p>
                                </div>
                            </div>

                            {/* STEP 3 */}
                            <div className="flex items-start gap-6 relative">
                                <div className="z-10 bg-white text-[#05674B] w-8 h-8 rounded-full flex items-center justify-center font-black text-lg">
                                    ✓
                                </div>

                                <div>
                                    <p className="text-base text-white/80 font-medium">Step 3</p>
                                    <h4 className="font-black text-xl lg:text-2xl mb-3 text-white">
                                        Connect and Earn
                                    </h4>
                                    <p className="text-base text-white/90 leading-relaxed font-medium">
                                        Complete delivery and earn with ease, No extra fees or subscription
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OnboardingEasy;