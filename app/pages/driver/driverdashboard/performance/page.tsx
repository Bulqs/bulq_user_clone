"use client"

import DriverDashboardLayout from "@/app/components/drivercomponents/DriverDashboard/DriverDashboardLayout";
import Months from "@/app/components/drivercomponents/DriverDashboard/Months";
import Today from "@/app/components/drivercomponents/DriverDashboard/Today";
import Weeks from "@/app/components/drivercomponents/DriverDashboard/Weeks";
import Year from "@/app/components/drivercomponents/DriverDashboard/Year";
import Tabs from "@/app/components/drivercomponents/Tabs";

const PerformancePage = () => {
    const tabs = [
        {
            id: 'tab1',
            label: 'Today',
            content: <Today />
        },
        {
            id: 'tab2',
            label: 'Week',
            content: <Weeks />
        },
        {
            id: 'tab3',
            label: 'Month',
            content: <Months />
        },
        {
            id: 'tab4',
            label: 'Year',
            content: <Year />
        },
    ];

    return (
        <DriverDashboardLayout>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Performance</h2>
                    <span className="text-sm text-gray-500">Last updated: Today</span>
                </div>

                <div className="w-full">
                    <Tabs tabs={tabs} defaultTab="tab1" />
                </div>
            </div>
        </DriverDashboardLayout>
    );
};

export default PerformancePage;