"use client";
import DriverDashboardLayout from "@/app/components/drivercomponents/DriverDashboard/DriverDashboardLayout";
import { useState, useEffect } from "react";
import {
    FaArrowDown,
    FaArrowRight,
    FaBox,
    FaCheck,
    FaExclamationTriangle,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaMotorcycle,
    FaRoute,
    FaTimes,
    FaTruck,
    FaClock,
} from "react-icons/fa";

type Order = {
    id: string;
    pickup: string;
    destination: string;
    distance: string;
    payment: string;
    timeEstimate: string;
    weight: string;
    items: string;
    urgent: boolean;
    fragile: boolean;
    status: "ongoing" | "processing" | "cancelled" | "accepted" | "in-progress";
    urgencyLevel: string;
};

const OrdersPage = () => {
    const [sortBy, setSortBy] = useState("Most Urgent");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [orders, setOrders] = useState<Order[]>([
        {
            id: "#ORD-78536",
            pickup: "Warehouse 5, Industrial Area",
            destination: "456 Retail Park, Shopping District",
            distance: "8.2 miles",
            payment: "$28.60",
            timeEstimate: "25-35 mins",
            weight: "120 lbs",
            items: "5 packages",
            urgent: true,
            fragile: true,
            status: "ongoing",
            urgencyLevel: "High",
        },
        {
            id: "#ORD-78945",
            pickup: "123 Main St, New York, NY 10001",
            destination: "456 Central Ave, Brooklyn, NY 11225",
            distance: "5.2 miles",
            payment: "$18.50",
            timeEstimate: "20-30 mins",
            weight: "80 lbs",
            items: "3 packages",
            urgent: false,
            fragile: false,
            status: "processing",
            urgencyLevel: "Medium",
        },
        {
            id: "#ORD-78946",
            pickup: "789 Broadway, Manhattan, NY 10003",
            destination: "321 Park Ave, Queens, NY 11375",
            distance: "8.7 miles",
            payment: "$32.75",
            timeEstimate: "35-45 mins",
            weight: "150 lbs",
            items: "8 packages",
            urgent: true,
            fragile: false,
            status: "ongoing",
            urgencyLevel: "High",
        },
        {
            id: "#ORD-78947",
            pickup: "654 Elm St, Bronx, NY 10451",
            destination: "987 Pine St, Staten Island, NY 10301",
            distance: "12.3 miles",
            payment: "$45.20",
            timeEstimate: "55-65 mins",
            weight: "200 lbs",
            items: "12 packages",
            urgent: false,
            fragile: true,
            status: "cancelled",
            urgencyLevel: "Low",
        },
    ]);

    const sortOptions = [
        "Most Urgent",
        "Highest Paid",
        "Fragile",
        "On Going Delivery",
        "Processing Delivery",
        "Cancelled",
        "Accepted",
        "In Progress",
    ];

    const handleAcceptOrder = (orderId: string) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status: "accepted" } : order
            )
        );

        // Set timeout to automatically change to "in-progress" after 5 seconds
        setTimeout(() => {
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: "in-progress" } : order
                )
            );
        }, 5000);
    };

    const sortedOrders = [...orders].sort((a, b) => {
        switch (sortBy) {
            case "Most Urgent":
                return a.urgent === b.urgent ? 0 : a.urgent ? -1 : 1;
            case "Highest Paid":
                return parseFloat(b.payment.slice(1)) - parseFloat(a.payment.slice(1));
            case "Fragile":
                return a.fragile === b.fragile ? 0 : a.fragile ? -1 : 1;
            case "On Going Delivery":
                return a.status === "ongoing" ? -1 : 1;
            case "Processing Delivery":
                return a.status === "processing" ? -1 : 1;
            case "Cancelled":
                return a.status === "cancelled" ? -1 : 1;
            case "Accepted":
                return a.status === "accepted" ? -1 : 1;
            case "In Progress":
                return a.status === "in-progress" ? -1 : 1;
            default:
                return 0;
        }
    });

    const getButtonConfig = (status: Order['status']) => {
        switch (status) {
            case 'accepted':
                return {
                    bgColor: 'bg-blue-600 hover:bg-blue-700',
                    text: 'Order Accepted',
                    icon: <FaCheck />
                };
            case 'in-progress':
                return {
                    bgColor: 'bg-orange-600 hover:bg-orange-700',
                    text: 'In Progress',
                    icon: <FaRoute />
                };
            default:
                return {
                    bgColor: 'bg-green-600 hover:bg-green-700',
                    text: 'Accept',
                    icon: <FaCheck />
                };
        }
    };

    return (
        <DriverDashboardLayout>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full overflow-y-scroll">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Available Orders</h2>
                    <span className="text-sm text-gray-500">Last updated: Today</span>
                </div>

                {/* Sort Dropdown */}
                <div className="relative mb-6">
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200 transition-all duration-200"
                    >
                        <span>Sorted by: {sortBy}</span>
                        <FaArrowDown
                            className={`text-xs transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>
                    {isSortOpen && (
                        <div className="absolute z-10 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200">
                            <ul className="py-1">
                                {sortOptions.map((option) => (
                                    <li key={option}>
                                        <button
                                            onClick={() => {
                                                setSortBy(option);
                                                setIsSortOpen(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm ${sortBy === option
                                                ? "bg-blue-50 text-blue-700"
                                                : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Orders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedOrders.map((order, index) => {
                        const buttonConfig = getButtonConfig(order.status);

                        return (
                            <div
                                key={index}
                                className="bg-appTitleBgColor rounded-xl border border-gray-200 shadow-xs overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
                                {/* Order Header */}
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-indigo-100 p-2 rounded-lg">
                                                <FaTruck className="text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white">{order.id}</h3>
                                                <p className="text-sm text-gray-200">
                                                    {order.timeEstimate}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-lg text-green-600">
                                            {order.payment}
                                        </span>
                                    </div>

                                    {/* Urgent/Fragile Tags */}
                                    <div className="flex gap-2 mt-3">
                                        {order.urgent && (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium">
                                                Urgent
                                            </span>
                                        )}
                                        {order.fragile && (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-md text-xs font-medium flex items-center gap-1">
                                                <FaExclamationTriangle className="text-xs" />
                                                Fragile
                                            </span>
                                        )}
                                        {order.status === "ongoing" && (
                                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                                                On Going
                                            </span>
                                        )}
                                        {order.status === "processing" && (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                                                Processing
                                            </span>
                                        )}
                                        {order.status === "cancelled" && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                                Cancelled
                                            </span>
                                        )}
                                        {order.status === "accepted" && (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                                                Order Accepted
                                            </span>
                                        )}
                                        {order.status === "in-progress" && (
                                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs font-medium">
                                                In Progress
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Map Preview with Distance */}
                                <div className="relative h-32 bg-gray-200 flex items-center justify-center text-gray-500">
                                    [Map Preview]
                                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-xs flex items-center gap-1">
                                        <FaRoute className="text-blue-500 text-sm" />
                                        <span className="font-medium text-gray-700">
                                            {order.distance}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="p-4">
                                    {/* Pickup and Delivery */}
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 text-red-500 mt-0.5">
                                                <FaMapMarkerAlt />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">
                                                    Pickup Location
                                                </h4>
                                                <p className="text-sm text-gray-200 line-clamp-2">
                                                    {order.pickup}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 text-green-500 mt-0.5">
                                                <FaMapMarkerAlt />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">
                                                    Delivery Location
                                                </h4>
                                                <p className="text-sm text-gray-200 line-clamp-2">
                                                    {order.destination}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Urgency and Items */}
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-red-100 p-2 rounded-lg">
                                                <FaClock className="text-red-600 text-sm" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-200">Urgency</p>
                                                <p className="font-medium text-gray-200">
                                                    {order.urgencyLevel}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="bg-orange-100 p-2 rounded-lg">
                                                <FaBox className="text-orange-600 text-sm" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-200">Items</p>
                                                <p className="font-medium text-gray-200">{order.items}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Weight and Express */}
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-amber-100 p-2 rounded-lg">
                                                <FaBox className="text-amber-600 text-sm" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-200">Weight</p>
                                                <p className="font-medium text-gray-200">{order.weight}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-blue-100 p-2 rounded-lg">
                                                <FaRoute className="text-blue-600 text-sm" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-200">Express</p>
                                                <p className="font-medium text-gray-200">
                                                    {order.urgent ? "Yes" : "No"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons with Vehicle */}
                                <div className="p-4 border-t border-gray-100 bg-gray-50">
                                    {order.status === "cancelled" ? (
                                        <button className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium cursor-not-allowed">
                                            Order Cancelled
                                        </button>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-purple-100 p-2 rounded-lg">
                                                    <FaMotorcycle className="text-purple-600 text-sm" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Vehicle</p>
                                                    <p className="font-medium text-gray-900">Motorbike</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => order.status === "ongoing" || order.status === "processing" ? handleAcceptOrder(order.id) : null}
                                                className={`flex items-center justify-center gap-1 px-3 py-2 text-white rounded-lg text-sm font-medium transition-colors ${buttonConfig.bgColor} ${order.status === "accepted" || order.status === "in-progress" ? "cursor-not-allowed" : "hover:shadow-md"
                                                    }`}
                                                disabled={order.status === "accepted" || order.status === "in-progress"}
                                            >
                                                {buttonConfig.icon} {buttonConfig.text}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-medium">1</span> to{" "}
                        <span className="font-medium">{orders.length}</span> of{" "}
                        <span className="font-medium">{orders.length}</span> orders
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 rounded-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Previous
                        </button>
                        <button className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
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
        </DriverDashboardLayout>
    );
};

export default OrdersPage;