import React from 'react';
import { IoStar } from "react-icons/io5";
import { FaQuoteLeft } from "react-icons/fa"; // Correct icon import

interface Testimonial {
    id: number;
    name: string;
    location: string;
    text: string;
    rating: number;
    gradient: string;
}

const TrustedByShopper = () => {
    const testimonials: Testimonial[] = [
        {
            id: 1,
            name: 'John Doe',
            location: 'London, UK',
            text: "The consolidation service is amazing. I ordered from 5 different stores and BulQ combined everything into one package, saving me over 60% on shipping.",
            rating: 5,
            gradient: 'from-blue-400 to-blue-600'
        },
        {
            id: 2,
            name: 'Emma Rodriguez',
            location: 'Oklahoma, USA',
            text: "I love the flexibility of the Premium plan. Weekly deliveries mean I never have to wait long for my purchases, and the insurance gives me peace of mind.",
            rating: 4,
            gradient: 'from-purple-400 to-purple-600'
        },
        {
            id: 3,
            name: 'Mitsuo JR',
            location: 'Tokyo, Japan',
            text: "BulQ has saved me so much on international shipping. I can shop from US stores and get everything delivered to Japan at a fraction of the cost!",
            rating: 5,
            gradient: 'from-orange-400 to-red-500'
        },
    ];

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <IoStar
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Testimonials</h2>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        Trusted by Shoppers Worldwide
                    </h3>
                    <p className="text-lg text-gray-500">
                        Join thousands of happy customers who ship with BulQ every day.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="group relative bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Decorative Quote Icon - Fixed */}
                            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FaQuoteLeft className="text-6xl text-appBanner" />
                            </div>

                            {/* Stars */}
                            <div className="mb-6">
                                {renderStars(testimonial.rating)}
                            </div>

                            {/* Text */}
                            <blockquote className="mb-8">
                                <p className="text-gray-700 leading-relaxed italic relative z-10">
                                    "{testimonial.text}"
                                </p>
                            </blockquote>

                            {/* User Info */}
                            <div className="flex items-center gap-4 mt-auto">
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedByShopper;