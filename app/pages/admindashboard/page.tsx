// pages/admin/index.tsx
"use client"

import { BsBoxFill } from "react-icons/bs"
import { FiUsers, FiDollarSign, FiTrendingUp, FiAlertTriangle, FiCheckCircle } from "react-icons/fi"
import { useState } from 'react'
import AdminDashboardLayout from "../../components/admindashboard/AdminDashboardLayout"

const AdminDashboard: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<string>("Month")

    const stats = [
        {
            title: 'Total Users',
            value: '2,847',
            change: '+12%',
            trend: 'up',
            icon: <FiUsers className="text-blue-600 text-2xl" />,
            color: 'blue'
        },
        {
            title: 'Total Revenue',
            value: '$184,230',
            change: '+8%',
            trend: 'up',
            icon: <FiDollarSign className="text-green-600 text-2xl" />,
            color: 'green'
        },
        {
            title: 'Active Packages',
            value: '1,234',
            change: '+5%',
            trend: 'up',
            icon: <BsBoxFill className="text-purple-600 text-2xl" />,
            color: 'purple'
        },
        {
            title: 'System Issues',
            value: '3',
            change: '-2%',
            trend: 'down',
            icon: <FiAlertTriangle className="text-red-600 text-2xl" />,
            color: 'red'
        }
    ]

    const recentActivities = [
        { id: 1, user: 'John Doe', action: 'created new shipment', time: '2 min ago', type: 'success' },
        { id: 2, user: 'Sarah Smith', action: 'updated profile', time: '5 min ago', type: 'info' },
        { id: 3, user: 'Mike Johnson', action: 'payment failed', time: '10 min ago', type: 'error' },
        { id: 4, user: 'System', action: 'backup completed', time: '1 hour ago', type: 'success' },
        { id: 5, user: 'Admin', action: 'updated system settings', time: '2 hours ago', type: 'info' },
    ]

    return (
        <AdminDashboardLayout>
            <div className="flex flex-col w-full">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-appBlack">Admin Dashboard</h1>
                        <p className="text-appTitleBgColor">System overview and analytics</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-appBanner"
                        >
                            <option value="Day">Today</option>
                            <option value="Week">This Week</option>
                            <option value="Month">This Month</option>
                            <option value="Year">This Year</option>
                        </select>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    <p className={`text-sm font-medium mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {stat.change} from last period
                                    </p>
                                </div>
                                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts and Activities Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">Revenue chart will be implemented here</p>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                                    <div className={`w-2 h-2 rounded-full ${activity.type === 'success' ? 'bg-green-500' :
                                            activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                                        }`}></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            <span className="font-semibold">{activity.user}</span> {activity.action}
                                        </p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                    {activity.type === 'success' && (
                                        <FiCheckCircle className="text-green-500" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-blue-700 font-medium">
                            Manage Users
                        </button>
                        <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-green-700 font-medium">
                            View Reports
                        </button>
                        <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-purple-700 font-medium">
                            System Settings
                        </button>
                        <button className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-orange-700 font-medium">
                            Support Tickets
                        </button>
                    </div>
                </div>
            </div>
        </AdminDashboardLayout>
    )
}

export default AdminDashboard