import React from 'react';
import Image from 'next/image';

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            title: 'Shop Anywhere',
            description: 'Purchase from any global e-commerce store using your BulQ warehouse address.',
            image: '/images/search.png' 
        },
        {
            id: 2,
            title: 'We Receive',
            description: 'Your items arrive at our secure warehouse where we inspect and store them safely.',
            image: '/images/home.png' 
        },
        {
            id: 3,
            title: 'We Consolidate',
            description: 'We professionally repack and consolidate multiple purchases into single efficient shipments.',
            image: '/images/package.png' 
        },
        {
            id: 4,
            title: 'We Deliver',
            description: 'Your consolidated package is shipped quickly and directly to your doorstep.',
            image: '/images/van.png' 
        }
    ];

    return (
        <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base font-semibold text-appBanner uppercase tracking-wide">Process</h2>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        How BulQ Works
                    </p>
                    <p className="mt-4 text-xl text-gray-500">
                        Get your international purchases delivered in 4 simple steps.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-2"
                        >
                            {/* Step Number Badge */}
                            <div className="absolute top-4 right-4">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-bold text-sm group-hover:bg-appBanner group-hover:text-white transition-colors duration-300">
                                    {step.id}
                                </span>
                            </div>

                            {/* Icon / Image Area */}
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center p-4 group-hover:scale-110 transition-transform duration-300">
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-appBanner transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Connector Line (Desktop Only - Visual decoration) */}
                            {step.id !== 4 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gray-100 transform -translate-y-1/2 z-0"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;