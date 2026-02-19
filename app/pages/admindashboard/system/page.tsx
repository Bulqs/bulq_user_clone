// app/admindashboard/system/page.tsx
"use client"

import AdminDashboardLayout from "@/app/components/admindashboard/AdminDashboardLayout"


const SystemPage = () => {
    return (
        <AdminDashboardLayout>
            <div className="flex flex-col w-full">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-appBlack">System Settings</h1>
                        <p className="text-appTitleBgColor">System configuration and settings</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                    <p className="text-gray-500">System settings content will be implemented here</p>
                </div>
            </div>
        </AdminDashboardLayout>
    )
}

export default SystemPage