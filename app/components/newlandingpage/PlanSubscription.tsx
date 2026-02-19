import React from 'react';
import { IoCheckmarkCircleSharp, IoStar } from "react-icons/io5";

const PlanSubscription = () => {
    const plans = [
        {
            id: 1,
            price: '$80',
            period: '/mo',
            title: 'Basic',
            tag: null,
            features: [
                'Up to 10 deliveries per month',
                'No repacking',
                'Pay-per-shipment insurance',
                'Monthly delivery frequency'
            ],
            buttonText: 'Get Basic',
            isPopular: false,
            accentColor: 'text-gray-900'
        },
        {
            id: 2,
            price: '$150',
            period: '/mo',
            title: 'Standard',
            tag: 'Most Popular',
            features: [
                'Up to 20 deliveries per month',
                'Bi-weekly delivery options',
                'Light repacking included',
                'Insurance up to $500 included'
            ],
            buttonText: 'Get Standard',
            isPopular: true,
            accentColor: 'text-blue-600'
        },
        {
            id: 3,
            price: '$250',
            period: '/mo',
            title: 'Premium',
            tag: null,
            features: [
                'Up to 40 deliveries per month',
                'Weekly delivery options',
                'Full repacking/consolidation',
                'Insurance up to $2,000 included'
            ],
            buttonText: 'Get Premium',
            isPopular: false,
            accentColor: 'text-appTitleBgColor' // Assuming this maps to a valid color class or hex
        }
    ];

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-appNav relative overflow-hidden">
            {/* Background Decor (Optional Subtle Glow) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-20">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-lg font-bold text-blue-400 uppercase tracking-wider mb-2">Pricing</h2>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                        Flexible Subscription Plans
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Choose the perfect plan that fits your global shopping needs. Upgrade or cancel anytime.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300 
                                ${plan.isPopular 
                                    ? 'shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-100 md:-translate-y-4 md:scale-105 z-10 border-2 border-blue-500' 
                                    : 'shadow-xl hover:shadow-2xl border border-gray-100 hover:-translate-y-2 opacity-95 hover:opacity-100'
                                }
                            `}
                        >
                            {/* Popular Tag */}
                            {plan.isPopular && (
                                <div className="absolute top-0 left-0 w-full bg-blue-600 text-white text-xs font-bold uppercase tracking-widest py-2 text-center">
                                    Most Popular
                                </div>
                            )}

                            <div className={`p-8 ${plan.isPopular ? 'pt-12' : 'pt-8'}`}>
                                {/* Title & Price */}
                                <h3 className={`text-xl font-bold mb-2 ${plan.accentColor}`}>{plan.title}</h3>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-5xl font-extrabold text-gray-900 tracking-tight">{plan.price}</span>
                                    <span className="text-lg text-gray-500 font-medium ml-1">{plan.period}</span>
                                </div>

                                {/* Divider */}
                                <div className="w-full h-px bg-gray-100 mb-6"></div>

                                {/* Features List */}
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <IoCheckmarkCircleSharp className={`w-6 h-6 shrink-0 mr-3 ${plan.isPopular ? 'text-blue-600' : 'text-green-500'}`} />
                                            <span className="text-gray-700 font-medium text-sm leading-relaxed">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Button Footer */}
                            <div className="p-8 pt-0 mt-auto">
                                <button
                                    className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 transform hover:scale-[1.02] shadow-md
                                        ${plan.isPopular 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }
                                    `}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PlanSubscription;