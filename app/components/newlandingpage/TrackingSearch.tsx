import React from 'react';

const TrackingSearch = () => {
    return (
        <div
            className="relative w-full min-h-[400px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/tracksearchbg.png')" }}
        >
            {/* Overlay for better text readability */}
            {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}

            <div className="relative z-10 w-full max-w-2xl px-0">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Track Your Package</h1>
                    <p className="text-xl text-gray-200">   
                        Enter Your Bulq Tracking Number to see the status of your shipment
                    </p>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Enter tracking number (e.g. BQ123456789)"
                        className="w-full py-4 px-6 rounded-full text-lg border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-lg"
                    />
                    <button
                        className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-200"
                    >
                        Track
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackingSearch;