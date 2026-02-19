"use client"

import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { CheckCircle, Clock, Star, AlertCircle } from 'lucide-react';
import DriverPerformanceStat from '../DriverPerformanceStat';
import StatCard from '../StatCard';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Months = () => {
    const deliveryData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Deliveries Completed',
                data: [480, 520, 460, 510],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
            {
                label: 'On-Time Deliveries',
                data: [420, 450, 400, 440],
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
            }
        ]
    };

    const ratingData = {
        labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
        datasets: [
            {
                data: [350, 240, 120, 40, 30],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(101, 163, 13, 0.7)',
                    'rgba(234, 179, 8, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(101, 163, 13, 1)',
                    'rgba(234, 179, 8, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <StatCard
                    title="Complete Deliveries"
                    value="480"
                    change="12% from last month"
                    icon={<CheckCircle size={16} className="text-blue-500" />}
                    trend="up"
                    bgColor="bg-blue-50"
                    borderColor="border-blue-100"
                />
                <StatCard
                    title="On-Time Rate"
                    value="85%"
                    change="3% from last month"
                    icon={<Clock size={16} className="text-green-500" />}
                    trend="up"
                    bgColor="bg-green-50"
                    borderColor="border-green-100"
                />
                <StatCard
                    title="Average Rating"
                    value="4.2"
                    change="0.3 from last month"
                    icon={<Star size={16} className="text-amber-500" />}
                    trend="up"
                    bgColor="bg-amber-50"
                    borderColor="border-amber-100"
                />
                <StatCard
                    title="Issues Reported"
                    value="8"
                    change="2 from last month"
                    icon={<AlertCircle size={16} className="text-red-500" />}
                    trend="down"
                    bgColor="bg-red-50"
                    borderColor="border-red-100"
                />
            </div>

            <div className="w-full flex flex-col md:flex-row items-stretch justify-between gap-6 mt-10">
                <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Delivery Performance</h3>
                    <div className="h-64">
                        <Bar
                            data={deliveryData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Number of Deliveries'
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Week of Month'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Rating Distribution</h3>
                    <div className="h-64">
                        <Pie
                            data={ratingData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right',
                                    },
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <DriverPerformanceStat
                    title="Miles Driven"
                    value="15,000m"
                    change="Monthly Goal: 20,000 miles"
                    percentage={75}
                    iconType="delivery"
                    trend="up"
                    bgColor="bg-blue-50"
                    borderColor="border-blue-100"
                />
                <DriverPerformanceStat
                    title="Fuel Efficiency"
                    value="18.8 mpg"
                    change="Fleet Average: 16.5 mpeg"
                    percentage={82}
                    iconType="fuel"
                    trend="up"
                    bgColor="bg-green-50"
                    borderColor="border-green-100"
                />
                <DriverPerformanceStat
                    title="Idle Time"
                    value="13%"
                    change="Fleet Average: 14%"
                    percentage={13}
                    iconType="time"
                    trend="down"
                    bgColor="bg-amber-50"
                    borderColor="border-amber-100"
                />
                <DriverPerformanceStat
                    title="Delivery Speed"
                    value="105 min"
                    change="Average time per delivery: 52min"
                    percentage={72}
                    iconType="speed"
                    trend="neutral"
                    bgColor="bg-purple-50"
                    borderColor="border-purple-100"
                />
                <DriverPerformanceStat
                    title="Vehicle Utilization"
                    value="80%"
                    change="Number of repair: 3 times"
                    percentage={80}
                    iconType="utilization"
                    trend="neutral"
                    bgColor="bg-red-50"
                    borderColor="border-red-100"
                />
            </div>
        </>
    );
};

export default Months;