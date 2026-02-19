"use client"
import DriverDashboardLayout from "@/app/components/drivercomponents/DriverDashboard/DriverDashboardLayout";
import { useState } from "react";
import { FaArrowRight, FaCheck, FaMapMarkerAlt, FaRoute, FaMoneyBillWave, FaTimes, FaTruck, FaBoxes, FaExclamationTriangle, FaPhone, FaCheckCircle, FaMapMarkedAlt} from "react-icons/fa";
import { HiOutlineTruck } from "react-icons/hi";



// Sample data for the table
const orders = [
    {
        id: "#ORD-78945",
        pickup: "123 Main St, New York, NY 10001",
        destination: "456 Central Ave, Brooklyn, NY 11225",
        distance: "5.2 miles",
        payment: "$18.50",
        timeEstimate: "25-35 mins"
    },
    {
        id: "#ORD-78946",
        pickup: "789 Broadway, Manhattan, NY 10003",
        destination: "321 Park Ave, Queens, NY 11375",
        distance: "8.7 miles",
        payment: "$26.75",
        timeEstimate: "40-50 mins"
    },
    {
        id: "#ORD-78947",
        pickup: "654 Elm St, Bronx, NY 10451",
        destination: "987 Pine St, Staten Island, NY 10301",
        distance: "12.3 miles",
        payment: "$35.20",
        timeEstimate: "55-65 mins"
    },
    {
        id: "#ORD-78948",
        pickup: "852 Oak Ave, Jersey City, NJ 07302",
        destination: "159 Maple Rd, Hoboken, NJ 07030",
        distance: "3.5 miles",
        payment: "$14.90",
        timeEstimate: "15-25 mins"
    },
    {
        id: "#ORD-78946",
        pickup: "789 Broadway, Manhattan, NY 10003",
        destination: "321 Park Ave, Queens, NY 11375",
        distance: "8.7 miles",
        payment: "$26.75",
        timeEstimate: "40-50 mins"
    },
    {
        id: "#ORD-78947",
        pickup: "654 Elm St, Bronx, NY 10451",
        destination: "987 Pine St, Staten Island, NY 10301",
        distance: "12.3 miles",
        payment: "$35.20",
        timeEstimate: "55-65 mins"
    },
    {
        id: "#ORD-78948",
        pickup: "852 Oak Ave, Jersey City, NJ 07302",
        destination: "159 Maple Rd, Hoboken, NJ 07030",
        distance: "3.5 miles",
        payment: "$14.90",
        timeEstimate: "15-25 mins"
    }
];


const DashboardPage = () => {

    // State for tracking delivery status
    const [deliveryStatus, setDeliveryStatus] = useState({
        status: "In Transit",
        color: "bg-blue-50 text-blue-700",
        dotColor: "bg-blue-400"
    });

    
    const cycleStatus = () => {
        const statuses = [
            { status: "In Transit", color: "bg-blue-50 text-blue-700", dotColor: "bg-blue-400" },
            { status: "In Progress", color: "bg-yellow-50 text-yellow-700", dotColor: "bg-yellow-400" },
            { status: "On Going Delivery", color: "bg-purple-50 text-purple-700", dotColor: "bg-purple-400" },
            { status: "Delivery Completed", color: "bg-green-50 text-green-700", dotColor: "bg-green-400" }
        ];

        const currentIndex = statuses.findIndex(s => s.status === deliveryStatus.status);
        const nextIndex = (currentIndex + 1) % statuses.length;
        setDeliveryStatus(statuses[nextIndex]);
    };

    // Function to mark as delivered directly
    const markAsDelivered = () => {
        setDeliveryStatus({
            status: "Delivery Completed",
            color: "bg-green-50 text-green-700",
            dotColor: "bg-green-400"
        });
    };

    return (
        <DriverDashboardLayout>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full overflow-y-scroll">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                    <span className="text-sm text-gray-500">Last updated: Today</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1 - Earnings */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wider">This Week Earnings</h3>
                                <p className="text-3xl font-bold mt-2 text-gray-900">$1,850</p>
                            </div>
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs text-blue-500 mt-4 flex items-center">
                            <span className="bg-blue-200 rounded-full px-2 py-1 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                12% from last week
                            </span>
                        </p>
                    </div>

                    {/* Card 2 - Deliveries */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-green-600 uppercase tracking-wider">Completed Deliveries</h3>
                                <p className="text-3xl font-bold mt-2 text-gray-900">24</p>
                            </div>
                            <div className="bg-green-100 p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs text-green-500 mt-4 flex items-center">
                            <span className="bg-green-200 rounded-full px-2 py-1 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                5% from last week
                            </span>
                        </p>
                    </div>

                    {/* Card 3 - Rating */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-purple-600 uppercase tracking-wider">Average Rating</h3>
                                <p className="text-3xl font-bold mt-2 text-gray-900">4.8</p>
                            </div>
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex items-center mt-4">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                            <span className="text-xs text-gray-500 ml-2">(128 reviews)</span>
                        </div>
                    </div>

                    {/* Card 4 - Vehicles */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-indigo-600 uppercase tracking-wider">Available Vehicles</h3>
                                <p className="text-3xl font-bold mt-2 text-gray-900">3</p>
                            </div>
                            <div className="bg-indigo-100 p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs text-indigo-500 mt-4">
                            <span className="bg-indigo-200 rounded-full px-2 py-1">2 active, 1 in maintenance</span>
                        </p>
                    </div>
                </div>

                <div className="flex w-full items-center justify-between mt-8 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Available Orders Near You</h2>
                        <p className="text-sm text-gray-500">Real-time order updates</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-appTitleBgColor hover:bg-appNav text-white rounded-lg transition-all duration-200">
                        <span>View All</span>
                        <FaArrowRight className="text-sm" />
                    </button>
                </div>

                {/* Modern Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="grid grid-cols-12 bg-gray-50 px-6 py-4 border-b border-gray-100">
                        <div className="col-span-2 font-medium text-xs text-gray-500 uppercase tracking-wider">ORDER</div>
                        <div className="col-span-3 font-medium text-xs text-gray-500 uppercase tracking-wider">PICKUP</div>
                        <div className="col-span-3 font-medium text-xs text-gray-500 uppercase tracking-wider">DESTINATION</div>
                        <div className="col-span-2 font-medium text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <FaRoute className="text-gray-400" /> DIST
                        </div>
                        <div className="col-span-1 font-medium text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1">
                            <FaMoneyBillWave className="text-gray-400" /> PAY
                        </div>
                        <div className="col-span-1 font-medium text-xs text-gray-500 uppercase tracking-wider">ACTION</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {orders.map((order, index) => (
                            <div key={index} className="grid grid-cols-12 px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                                <div className="col-span-2 flex items-center">
                                    <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                        <HiOutlineTruck className="text-indigo-600" />
                                    </div>
                                    <span className="font-medium text-gray-900">{order.id}</span>
                                </div>
                                <div className="col-span-3 flex items-start">
                                    <FaMapMarkerAlt className="text-red-400 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-sm text-gray-600 line-clamp-2">{order.pickup}</span>
                                </div>
                                <div className="col-span-3 flex items-start">
                                    <FaMapMarkerAlt className="text-green-400 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-sm text-gray-600 line-clamp-2">{order.destination}</span>
                                </div>
                                <div className="col-span-2 flex flex-col">
                                    <span className="text-sm font-medium text-gray-900">{order.distance}</span>
                                    <span className="text-xs text-gray-400">{order.timeEstimate}</span>
                                </div>
                                <div className="col-span-1">
                                    <span className="font-medium text-green-600">{order.payment}</span>
                                </div>
                                <div className="col-span-1 flex items-center">
                                    <button className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200">
                                        <FaCheck className="mr-1.5" />
                                        Accept
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table Footer */}
                    <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of <span className="font-medium">12</span> orders
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Previous
                            </button>
                            <button className="px-3 py-1 rounded-md bg-appTitleBgColor text-white text-sm font-medium hover:bg-indigo-700">
                                1
                            </button>
                            <button className="px-3 py-1 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                2
                            </button>
                            <button className="px-3 py-1 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ongoing Delivery */}
                <div className="flex w-full items-center justify-between mt-8 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Ongoing Delivery</h2>
                        {/* <p className="text-sm text-gray-500">Real-time order updates</p> */}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-appTitleBgColor hover:bg-appNav text-white rounded-lg transition-all duration-200">
                        <span> All Deliveries </span>
                        <FaArrowRight className="text-sm" />
                    </button>
                </div>

                {/* Map Section */}

                <div className="flex items-center justify-between">

                    <div className="w-1/2 h-96 bg-appTitleBgColor rounded-l-lg">

                    </div>



                    <div className="w-1/2 h-96 bg-appNav p-6 flex flex-col rounded-r-lg">
                        <h3>ORDER: #ORD-78536</h3>

                        
                        {/* Delivery Info - Modern Table-like Layout */}
                        <div className="space-y-4 mt-2">
                            {/* Pickup */}
                            <div className="flex gap-4">
                                <div className="w-24 flex-shrink-0 flex items-start gap-2 text-white">
                                    <FaMapMarkerAlt className="mt-0.5 text-red-400" />
                                    <span className="font-medium">Pickup:</span>
                                </div>
                                <div className="text-white">
                                    Warehouse 5, Industrial Area
                                </div>
                            </div>

                            {/* Delivery */}
                            <div className="flex gap-4">
                                <div className="w-24 flex-shrink-0 flex items-start gap-2 text-white">
                                    <FaMapMarkerAlt className="mt-0.5 text-green-400" />
                                    <span className="font-medium">Delivery:</span>
                                </div>
                                <div className="text-white">
                                    456 Retail Park, Shopping District
                                </div>
                            </div>

                            {/* Distance */}
                            <div className="flex gap-4">
                                <div className="w-24 flex-shrink-0 flex items-start gap-2 text-white">
                                    <FaRoute className="mt-0.5 text-blue-400" />
                                    <span className="font-medium">Distance:</span>
                                </div>
                                <div className="text-white">
                                    9.7 miles <span className="text-white">(25-35 mins)</span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="flex gap-4">
                                <div className="w-24 flex-shrink-0 flex items-start gap-2 text-white">
                                    <FaBoxes className="mt-0.5 text-purple-400" />
                                    <span className="font-medium">Items:</span>
                                </div>
                                <div className="text-white">
                                    12 Packages <span className="text-white">(Total 450 lbs)</span>
                                </div>
                            </div>

                            {/* Caution */}
                            <div className="flex gap-4">
                                <div className="w-24 flex-shrink-0 flex items-start gap-2  text-white">
                                    <FaExclamationTriangle className="mt-0.5 text-yellow-400" />
                                    <span className="font-medium">Caution:</span>
                                </div>
                                <div className="text-white">
                                    <span className="px-2 py-1 bg-yellow-50 text-gray-700 rounded-md text-sm">
                                        Fragile Items - Handle with care
                                    </span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex gap-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-24 flex-shrink-0 flex items-start gap-2 text-white">
                                        <div className={`w-4 h-4 mt-0.5 rounded-full ${deliveryStatus.dotColor}`}></div>
                                        <span className="font-medium">Status:</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-md text-sm ${deliveryStatus.color}`}>
                                            {deliveryStatus.status}
                                        </span>
                                        {deliveryStatus.status !== "Delivery Completed" && (
                                            <button
                                                onClick={cycleStatus}
                                                className="p-1 text-white hover:bg-white/20 rounded-full transition-colors"
                                                aria-label="Update status"
                                            >
                                                <FaArrowRight className="text-sm" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100 mt-4">
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                <FaMapMarkedAlt />
                                Navigation
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                                <FaCheckCircle />
                                Mark Delivered
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                                <FaPhone />
                                Call Customer
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </DriverDashboardLayout>
    );
};

export default DashboardPage;