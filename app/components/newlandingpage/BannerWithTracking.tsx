"use client"; // Required for hooks

import React, { useState } from 'react';
import TrackingModal from '../modals/TrackingModal';
import Image from 'next/image';

const BannerWithTracking = () => {
    // State for the input field in the banner
    const [inputTracking, setInputTracking] = useState('');
    // State to toggle the modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle the search action
    const handleTrackClick = () => {
        setIsModalOpen(true);
        // The modal will read 'inputTracking' via the 'initialTrackingNumber' prop 
        // and trigger the search automatically.
    };

    return (
        <div className="relative">
            {/* Banner Component */}
            <div className='w-full relative h-[584px] flex items-center justify-center'>
                {/* <video
                    className='absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover'
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                >
                    <source src="/videos/bulq_anime.gif" type="video/mp4" />
                    Your browser does not support the video tag.
                </video> */}
                <Image
                    className='absolute z-0 w-full h-full object-cover'
                    src="/videos/bulq_anime.gif"
                    alt="Background Animation"
                />

                {/* Overlay to make text more readable */}
                <div className='absolute inset-0 bg-appTitleBgColor bg-opacity-90 z-1'></div>

                {/* Content Container */}
                <div className='relative z-10 text-center text-white px-4'>
                    <h2 className='font-bold text-5xl mb-6'>Shop Globally, Ship Smartly</h2>
                    <p className="font-semibold text-xl mb-8">
                        <span className='block'>Your centralized logistics solution for international shopping.</span>
                        <span className='block'>We consolidate and deliver your purchases worldwide</span>
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button className="px-8 py-3 bg-appNav rounded-md text-white hover:bg-opacity-90 transition hover:bg-appTitleBgColor hover:border-appNav hover:border-2 border-2 border-transparent">
                            Get Started
                        </button>
                        <button className="px-8 py-3 bg-transparent rounded-md text-white hover:bg-white hover:bg-opacity-10 transition">
                            <span className="border-b-2 border-white">Learn More</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tracking Search Overlay */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-6xl px-4 z-20">
                {/* Background image container */}
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
                        style={{ backgroundImage: "url('/images/tracksearchbg.png')" }}
                    ></div>
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                </div>

                {/* Content container */}
                <div className="relative rounded-xl shadow-2xl p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-bold text-white mb-2">Track Your Package</h1>
                        <p className="text-lg text-white">
                            Enter Your Bulq Tracking Number to see the status of your shipment
                        </p>
                    </div>

                    <div className="relative flex">
                        <input
                            type="text"
                            value={inputTracking}
                            onChange={(e) => setInputTracking(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleTrackClick()}
                            placeholder="Enter tracking number (e.g. BQ123456789)"
                            className="flex-grow py-4 px-6 rounded-l-full text-lg border border-gray-300 focus:ring-2 focus:ring-appNav focus:border-blue-500 focus:outline-none bg-white bg-opacity-90 text-gray-900"
                        />
                        <button
                            onClick={handleTrackClick}
                            className="bg-appNav hover:bg-appTitleBgColor text-white font-bold py-4 px-8 rounded-r-full transition duration-200 whitespace-nowrap"
                        >
                            Track Package
                        </button>
                    </div>
                </div>
            </div>

            {/* Tracking Modal Integration */}
            <TrackingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialTrackingNumber={inputTracking}
            />
        </div>
    );
};

export default BannerWithTracking;