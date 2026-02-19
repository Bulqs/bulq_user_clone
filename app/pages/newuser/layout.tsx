// src/app/user/layout.tsx
import Sidebar from '@/app/components/newuserdashboardlayout/Sidebar'
import TopBar from '@/app/components/newuserdashboardlayout/TopBar'
import Footer from '@/app/components/newuserdashboardlayout/Footer'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Bulq Logistics - User Dashboard',
    description: 'User dashboard for Bulq Logistics',
}

const UserLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <html lang="en" className="h-full">
            <body className={`${inter.className} bg-gray-50 h-full`}>
                <div className="flex h-screen bg-gray-50">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* TopBar */}
                        <TopBar />

                        {/* Main Content Area */}
                        <main className="flex-1 overflow-auto bg-gradient-to-br from-appWhite to-appBanner/10">
                            <div className="p-4 lg:p-6 max-h-full h-full">
                                <div className="max-w-7xl mx-auto w-full h-full">
                                    {children}
                                </div>
                            </div>
                        </main>

                        {/* Footer */}
                        <Footer />
                    </div>
                </div>
            </body>
        </html>
    )
}

export default UserLayout