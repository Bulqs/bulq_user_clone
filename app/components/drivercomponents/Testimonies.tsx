"use client"
import React from 'react';
import Image from 'next/image';
import testImg from '../../../public/images/testImg.png';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

const Testimonies: React.FC = () => {
    // Enhanced testimonial data with ratings and roles
    const testimonials = [
        {
            id: 1,
            name: "Michael Rodriguez",
            role: "Delivery Driver",
            text: "This platform has transformed how I manage my deliveries. The interface is intuitive and the support team is always helpful when I need assistance.",
            rating: 5
        },
        {
            id: 2,
            name: "Sarah Chen",
            role: "Logistics Partner",
            text: "Outstanding service and reliable platform. The real-time tracking features have made my job so much easier and efficient.",
            rating: 5
        },
        {
            id: 3,
            name: "James Wilson",
            role: "Fleet Driver",
            text: "The best logistics app I've used. It saves me hours every week and helps me optimize my routes perfectly.",
            rating: 4
        },
        {
            id: 4,
            name: "Emily Davis",
            role: "Courier Specialist",
            text: "Excellent customer support and seamless experience. The app is constantly improving with new features.",
            rating: 5
        },
        {
            id: 5,
            name: "David Thompson",
            role: "Transport Operator",
            text: "Reliable, efficient, and user-friendly. This platform has significantly improved our delivery operations.",
            rating: 4
        },
        {
            id: 6,
            name: "Lisa Martinez",
            role: "Distribution Expert",
            text: "The analytics and reporting features are incredibly helpful for optimizing our delivery routes and schedules.",
            rating: 5
        }
    ];

    // Star rating component
    const StarRating = ({ rating }: { rating: number }) => {
        return (
            <div className="flex justify-center space-x-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        mode: "snap",
        slides: {
            origin: "center",
            perView: 3,
            spacing: 25,
        },
        breakpoints: {
            '(max-width: 1024px)': {
                slides: {
                    perView: 2,
                    spacing: 20,
                }
            },
            '(max-width: 768px)': {
                slides: {
                    perView: 1,
                    spacing: 15,
                }
            }
        }
    });

    return (
        <div className="w-full bg-gradient-to-b from-gray-50 to-white py-16 px-4 relative">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h4 className='text-3xl font-bold text-appTitleBgColor mb-4'>WHAT OUR DRIVERS SAY</h4>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Hear from our dedicated team of drivers who are making logistics better every day
                    </p>
                </div>

                <div className="relative w-full">
                    {/* Navigation Arrows - Enhanced */}
                    <button
                        onClick={() => instanceRef.current?.prev()}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-100"
                        aria-label="Previous testimonial"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-appTitleBgColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Slider Container */}
                    <div ref={sliderRef} className="keen-slider w-full py-8">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="keen-slider__slide">
                                <div className="flex flex-col items-center justify-between h-full mx-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-2 border border-gray-100 overflow-hidden group">
                                    {/* Top Content */}
                                    <div className="flex flex-col items-center text-center p-6 flex-grow">
                                        {/* Profile Image with Enhanced Styling */}
                                        <div className="relative mb-4 group-hover:scale-105 transition-transform duration-300">
                                            <div className="absolute inset-0 bg-appTitleBgColor rounded-full opacity-10 transform scale-110"></div>
                                            <Image
                                                src={testImg}
                                                alt={testimonial.name}
                                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                                                width={80}
                                                height={80}
                                            />
                                        </div>

                                        {/* Name and Role */}
                                        <h3 className="text-lg font-bold text-appTitleBgColor mb-1">{testimonial.name}</h3>
                                        <p className="text-sm text-gray-500 mb-3">{testimonial.role}</p>

                                        {/* Star Rating */}
                                        <StarRating rating={testimonial.rating} />

                                        {/* Testimonial Text */}
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            "{testimonial.text}"
                                        </p>
                                    </div>

                                    {/* Colored Bottom Bar */}
                                    <div className="w-full bg-gradient-to-r from-appTitleBgColor to-appBanner h-2"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => instanceRef.current?.next()}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-100"
                        aria-label="Next testimonial"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-appTitleBgColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center space-x-2 mt-8">
                    {testimonials.slice(0, 3).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => instanceRef.current?.moveToIdx(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${instanceRef.current?.track.details.rel === index
                                    ? 'bg-appTitleBgColor w-6'
                                    : 'bg-gray-300 hover:bg-appTitleBgColor/50'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Testimonies;