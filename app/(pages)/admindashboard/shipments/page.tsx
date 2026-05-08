"use client"

import AdminDashboardLayout from "@/app/components/admindashboard/AdminDashboardLayout"

const ShipmentsPage = () => {
    return (
        <AdminDashboardLayout>
            <div className="flex flex-col w-full">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-appBlack">Shipments Management</h1>
                        <p className="text-appTitleBgColor">Manage all shipments</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                    <p className="text-gray-500">Shipments management content will be implemented here</p>
                </div>
            </div>
        </AdminDashboardLayout>
    )
}

export default ShipmentsPage