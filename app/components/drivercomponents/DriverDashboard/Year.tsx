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

const Year = () => {
    const deliveryData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Deliveries Completed',
                data: [420, 480, 510, 490, 550, 580, 560, 600, 570, 590, 630, 680],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
            {
                label: 'On-Time Deliveries',
                data: [380, 430, 460, 440, 490, 520, 500, 540, 510, 530, 570, 620],
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
                data: [4200, 3000, 1500, 500, 400],
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
                    value="5,760"
                    change="18% from last year"
                    icon={<CheckCircle size={16} className="text-blue-500" />}
                    trend="up"
                    bgColor="bg-blue-50"
                    borderColor="border-blue-100"
                />
                <StatCard
                    title="On-Time Rate"
                    value="83%"
                    change="5% from last year"
                    icon={<Clock size={16} className="text-green-500" />}
                    trend="up"
                    bgColor="bg-green-50"
                    borderColor="border-green-100"
                />
                <StatCard
                    title="Average Rating"
                    value="4.3"
                    change="0.4 from last year"
                    icon={<Star size={16} className="text-amber-500" />}
                    trend="up"
                    bgColor="bg-amber-50"
                    borderColor="border-amber-100"
                />
                <StatCard
                    title="Issues Reported"
                    value="42"
                    change="5 from last year"
                    icon={<AlertCircle size={16} className="text-red-500" />}
                    trend="down"
                    bgColor="bg-red-50"
                    borderColor="border-red-100"
                />
            </div>

            <div className="w-full flex flex-col md:flex-row items-stretch justify-between gap-6 mt-10">
                <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Annual Delivery Performance</h3>
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
                                            text: 'Month'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Annual Rating Distribution</h3>
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
                    value="180,000m"
                    change="Annual Goal: 200,000 miles"
                    percentage={90}
                    iconType="delivery"
                    trend="up"
                    bgColor="bg-blue-50"
                    borderColor="border-blue-100"
                />
                <DriverPerformanceStat
                    title="Fuel Efficiency"
                    value="17.5 mpg"
                    change="Fleet Average: 15.8 mpeg"
                    percentage={78}
                    iconType="fuel"
                    trend="up"
                    bgColor="bg-green-50"
                    borderColor="border-green-100"
                />
                <DriverPerformanceStat
                    title="Idle Time"
                    value="12%"
                    change="Fleet Average: 13%"
                    percentage={12}
                    iconType="time"
                    trend="down"
                    bgColor="bg-amber-50"
                    borderColor="border-amber-100"
                />
                <DriverPerformanceStat
                    title="Delivery Speed"
                    value="100 min"
                    change="Average time per delivery: 50min"
                    percentage={80}
                    iconType="speed"
                    trend="neutral"
                    bgColor="bg-purple-50"
                    borderColor="border-purple-100"
                />
                <DriverPerformanceStat
                    title="Vehicle Utilization"
                    value="85%"
                    change="Number of repair: 12 times"
                    percentage={85}
                    iconType="utilization"
                    trend="neutral"
                    bgColor="bg-red-50"
                    borderColor="border-red-100"
                />
            </div>
        </>
    );
};

export default Year;