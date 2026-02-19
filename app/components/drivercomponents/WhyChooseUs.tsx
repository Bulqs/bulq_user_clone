import React from 'react'

const WhyChooseUs: React.FC = () => {
    const features = [
        {
            title: "Benefits For Drivers",
            items: [
                "Choose your own schedule/route",
                "Top tier pay rate and bonuses",
                "Access to diverse cargo types and routes",
                "Career growth with advancement opportunities"
            ]
        },
        {
            title: "Technology & Innovation",
            items: [
                "Streamline your deliveries efficiently",
                "Real-time tracking and updates",
                "Smart route optimization",
                "Digital documentation and paperwork"
            ]
        },
        {
            title: "Support & Community",
            items: [
                "24/7 dedicated support team",
                "Driver community network",
                "Regular training and workshops",
                "Safety and compliance assistance"
            ]
        }
    ];

    return (
        <div className="w-full bg-gray-50 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-appTitleBgColor mb-4">
                        WHY CHOOSE US
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Experience the difference with our comprehensive logistics solutions designed
                        to empower drivers and streamline operations.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100"
                        >
                            {/* Feature Icon/Number */}
                            <div className="flex items-center justify-center w-12 h-12 bg-appTitleBgColor/10 rounded-full mb-6">
                                <span className="text-appTitleBgColor font-bold text-lg">
                                    {index + 1}
                                </span>
                            </div>

                            {/* Feature Title */}
                            <h3 className="text-xl font-bold text-appTitleBgColor mb-4">
                                {feature.title}
                            </h3>

                            {/* Feature List */}
                            <ul className="space-y-3">
                                {feature.items.map((item, itemIndex) => (
                                    <li
                                        key={itemIndex}
                                        className="flex items-start text-gray-700"
                                    >
                                        <div className="flex-shrink-0 w-6 h-6">
                                            <div className="w-2 h-2 bg-appTitleBgColor rounded-full mt-2" />
                                        </div>
                                        <span className="text-base leading-relaxed">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* Bottom Accent */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="w-12 h-1 bg-appTitleBgColor rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12">
                    <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-8 py-6 shadow-lg border border-gray-100">
                        <div className="text-left">
                            <h4 className="font-semibold text-gray-900 text-lg">
                                Ready to get started?
                            </h4>
                            <p className="text-gray-600 text-sm">
                                Join hundreds of satisfied drivers today
                            </p>
                        </div>
                        <button className="bg-appTitleBgColor text-white px-6 py-3 rounded-lg font-semibold hover:bg-appTitleBgColor/90 transition-colors duration-200">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;