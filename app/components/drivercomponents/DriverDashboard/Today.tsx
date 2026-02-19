// "use client"

// import React from 'react';
// import { CheckCircle, Clock, Star, AlertCircle } from 'lucide-react';
// import StatCard from '../StatCard';
// import { Bar, Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
// import DriverPerformanceStat from '../DriverPerformanceStat';

// // Register ChartJS components
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     ArcElement,
//     Title,
//     Tooltip,
//     Legend
// );

// const Today: React.FC = () => {
//     // Data for bar chart (delivery performance)
//     const deliveryData = {
//         labels: ['6am', '9am', '12pm', '3pm', '6pm', '9pm'],
//         datasets: [
//             {
//                 label: 'Deliveries Completed',
//                 data: [12, 19, 15, 27, 22, 18],
//                 backgroundColor: 'rgba(59, 130, 246, 0.7)',
//                 borderColor: 'rgba(59, 130, 246, 1)',
//                 borderWidth: 1,
//             },
//             {
//                 label: 'On-Time Deliveries',
//                 data: [10, 16, 12, 24, 20, 16],
//                 backgroundColor: 'rgba(16, 185, 129, 0.7)',
//                 borderColor: 'rgba(16, 185, 129, 1)',
//                 borderWidth: 1,
//             }
//         ]
//     };

//     // Data for pie chart (rating distribution)
//     const ratingData = {
//         labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
//         datasets: [
//             {
//                 data: [45, 30, 15, 5, 5],
//                 backgroundColor: [
//                     'rgba(16, 185, 129, 0.7)',
//                     'rgba(101, 163, 13, 0.7)',
//                     'rgba(234, 179, 8, 0.7)',
//                     'rgba(245, 158, 11, 0.7)',
//                     'rgba(239, 68, 68, 0.7)'
//                 ],
//                 borderColor: [
//                     'rgba(16, 185, 129, 1)',
//                     'rgba(101, 163, 13, 1)',
//                     'rgba(234, 179, 8, 1)',
//                     'rgba(245, 158, 11, 1)',
//                     'rgba(239, 68, 68, 1)'
//                 ],
//                 borderWidth: 1,
//             },
//         ],
//     };

//     return (
//         <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
//                 <StatCard
//                     title="Complete Deliveries"
//                     value="20"
//                     change="15% from yesterday"
//                     icon={<CheckCircle size={16} className="text-blue-500" />}
//                     trend="up"
//                     bgColor="bg-blue-50"
//                     borderColor="border-blue-100"
//                 />
//                 <StatCard
//                     title="On-Time Rate"
//                     value="90%"
//                     change="5% from yesterday"
//                     icon={<Clock size={16} className="text-green-500" />}
//                     trend="up"
//                     bgColor="bg-green-50"
//                     borderColor="border-green-100"
//                 />
//                 <StatCard
//                     title="Average Rating"
//                     value="3.8"
//                     change="0.5 from yesterday"
//                     icon={<Star size={16} className="text-amber-500" />}
//                     trend="down"
//                     bgColor="bg-amber-50"
//                     borderColor="border-amber-100"
//                 />
//                 <StatCard
//                     title="Issues Reported"
//                     value="1"
//                     change="0% from yesterday"
//                     icon={<AlertCircle size={16} className="text-red-500" />}
//                     trend="neutral"
//                     bgColor="bg-red-50"
//                     borderColor="border-red-100"
//                 />
//             </div>

//             <div className="w-full flex flex-col md:flex-row items-stretch justify-between gap-6 mt-10">
//                 <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//                     <div className="flex items-center justify-between mb-4">
//                         <h3 className="text-lg font-semibold text-gray-800">Delivery Performance</h3>
//                     </div>
//                     <div className="h-64">
//                         <Bar
//                             data={deliveryData}
//                             options={{
//                                 responsive: true,
//                                 maintainAspectRatio: false,
//                                 plugins: {
//                                     legend: {
//                                         position: 'top' as const,
//                                     },
//                                 },
//                                 scales: {
//                                     y: {
//                                         beginAtZero: true,
//                                         title: {
//                                             display: true,
//                                             text: 'Number of Deliveries'
//                                         }
//                                     },
//                                     x: {
//                                         title: {
//                                             display: true,
//                                             text: 'Time of Day'
//                                         }
//                                     }
//                                 }
//                             }}
//                         />
//                     </div>
//                 </div>

//                 <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//                     <div className="flex items-center justify-between mb-4">
//                         <h3 className="text-lg font-semibold text-gray-800">Customer Rating Distribution</h3>
//                     </div>
//                     <div className="h-64">
//                         <Pie
//                             data={ratingData}
//                             options={{
//                                 responsive: true,
//                                 maintainAspectRatio: false,
//                                 plugins: {
//                                     legend: {
//                                         position: 'right' as const,
//                                     },
//                                 }
//                             }}
//                         />
//                     </div>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
//                 <DriverPerformanceStat
//                     title="Miles Driven"
//                     value="500m"
//                     change="Daily Goal: 1,000 miles"
//                     icon={<CheckCircle size={16} className="text-blue-500" />}
//                     trend="up"
//                     bgColor="bg-blue-50"
//                     borderColor="border-blue-100"
//                 />
//                 <DriverPerformanceStat
//                     title="Fuel Efficiency"
//                     value="20.0 mpg"
//                     change="Fleet Average: 15.6 mpeg"
//                     icon={<Clock size={16} className="text-green-500" />}
//                     trend="up"
//                     bgColor="bg-green-50"
//                     borderColor="border-green-100"
//                 />

//                 <DriverPerformanceStat
//                     title="Idle Time"
//                     value="15%"
//                     change="Fleet Average: 16%"
//                     icon={<Star size={16} className="text-amber-500" />}
//                     trend="down"
//                     bgColor="bg-amber-50"
//                     borderColor="border-amber-100"
//                 />
//                 <DriverPerformanceStat
//                     title="Delivery Speed"
//                     value="120 min"
//                     change="Average time per delivery: 50min"
//                     icon={<AlertCircle size={16} className="text-red-500" />}
//                     trend="neutral"
//                     bgColor="bg-red-50"
//                     borderColor="border-red-100"
//                 />
//                 <DriverPerformanceStat
//                     title="Vehicle Utilization"
//                     value="50%"
//                     change="Number of repair: 1 time"
//                     icon={<AlertCircle size={16} className="text-red-500" />}
//                     trend="neutral"
//                     bgColor="bg-red-50"
//                     borderColor="border-red-100"
//                 />
//             </div>

//         </>
//     );
// };

// export default Today;



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

const Today: React.FC = () => {
    // Chart data remains the same as before
    const deliveryData = {
        labels: ['6am', '9am', '12pm', '3pm', '6pm', '9pm'],
        datasets: [
            {
                label: 'Deliveries Completed',
                data: [12, 19, 15, 27, 22, 18],
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
            {
                label: 'On-Time Deliveries',
                data: [10, 16, 12, 24, 20, 16],
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
                data: [45, 30, 15, 5, 5],
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
                        value="20"
                        change="15% from yesterday"
                        icon={<CheckCircle size={16} className="text-blue-500" />}
                        trend="up"
                        bgColor="bg-blue-50"
                        borderColor="border-blue-100"
                    />
                    <StatCard
                        title="On-Time Rate"
                        value="90%"
                        change="5% from yesterday"
                        icon={<Clock size={16} className="text-green-500" />}
                        trend="up"
                        bgColor="bg-green-50"
                        borderColor="border-green-100"
                    />
                    <StatCard
                        title="Average Rating"
                        value="3.8"
                        change="0.5 from yesterday"
                        icon={<Star size={16} className="text-amber-500" />}
                        trend="down"
                        bgColor="bg-amber-50"
                        borderColor="border-amber-100"
                    />
                    <StatCard
                        title="Issues Reported"
                        value="1"
                        change="0% from yesterday"
                        icon={<AlertCircle size={16} className="text-red-500" />}
                        trend="neutral"
                        bgColor="bg-red-50"
                        borderColor="border-red-100"
                    />
           
            </div>

            <div className="w-full flex flex-col md:flex-row items-stretch justify-between gap-6 mt-10">
                {/* Charts remain the same */}
                <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Delivery Performance</h3>
                    </div>
                    <div className="h-64">
                        <Bar
                            data={deliveryData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top' as const,
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
                                            text: 'Time of Day'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Customer Rating Distribution</h3>
                    </div>
                    <div className="h-64">
                        <Pie
                            data={ratingData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right' as const,
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
                    value="500m"
                    change="Daily Goal: 1,000 miles"
                    percentage={50}
                    iconType="delivery"
                    trend="up"
                    bgColor="bg-blue-50"
                    borderColor="border-blue-100"
                />
                <DriverPerformanceStat
                    title="Fuel Efficiency"
                    value="20.0 mpg"
                    change="Fleet Average: 15.6 mpeg"
                    percentage={85}
                    iconType="fuel"
                    trend="up"
                    bgColor="bg-green-50"
                    borderColor="border-green-100"
                />
                <DriverPerformanceStat
                    title="Idle Time"
                    value="15%"
                    change="Fleet Average: 16%"
                    percentage={15}
                    iconType="time"
                    trend="down"
                    bgColor="bg-amber-50"
                    borderColor="border-amber-100"
                />
                <DriverPerformanceStat
                    title="Delivery Speed"
                    value="120 min"
                    change="Average time per delivery: 50min"
                    percentage={65}
                    iconType="speed"
                    trend="neutral"
                    bgColor="bg-purple-50"
                    borderColor="border-purple-100"
                />
                <DriverPerformanceStat
                    title="Vehicle Utilization"
                    value="50%"
                    change="Number of repair: 1 time"
                    percentage={50}
                    iconType="utilization"
                    trend="neutral"
                    bgColor="bg-red-50"
                    borderColor="border-red-100"
                />
            </div>
        </>
    );
};

export default Today;