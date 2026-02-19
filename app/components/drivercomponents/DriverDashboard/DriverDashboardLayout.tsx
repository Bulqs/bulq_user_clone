// layouts/DriverDashboardLayout.tsx
"use client"
import { ReactNode, useState } from 'react';
import Aside from './Aside';
import Header from './Header';
import Footer from './Footer';


interface DriverDashboardLayoutProps {
    children: ReactNode;
}

const DriverDashboardLayout = ({ children }: DriverDashboardLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Aside
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header
                    onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
                />

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto bg-gradient-to-br from-appWhite to-appBanner/10">
                    <div className="p-4 lg:p-6 max-h-full h-full">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default DriverDashboardLayout;

