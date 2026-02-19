// src/components/admin/AdminDashboardLayout.tsx
"use client"
import AdminFooter from '@/app/components/admindashboard/AdminFooter'
import AdminSidebar from '@/app/components/admindashboard/AdminSidebar'
import AdminTopBar from '@/app/components/admindashboard/AdminTopBar'
import { ReactNode } from 'react'

interface AdminDashboardLayoutProps {
    children: ReactNode
}

const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
    return (
        <div className="max-h-screen bg-gray-50 flex flex-col">
            <div className="flex flex-1 h-screen">
                {/* Sidebar - Fixed height */}
                <div className="flex-shrink-0">
                    <AdminSidebar />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
                    {/* TopBar - Fixed */}
                    <div className="flex-shrink-0">
                        <AdminTopBar />
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Page Content - Scrollable */}
                        <main className="flex-1 overflow-auto bg-gray-50 p-4 lg:p-6">
                            {children}
                        </main>

                        {/* Footer */}
                        <div className="flex-shrink-0">
                            <AdminFooter />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardLayout