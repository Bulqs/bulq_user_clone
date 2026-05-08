import DriverDashboardLayout from "@/app/components/drivercomponents/DriverDashboard/DriverDashboardLayout";

const EarningsPage = () => {
    return (
        <DriverDashboardLayout>
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">Earnings</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-green-800">Today</h3>
                        <p className="text-2xl font-bold mt-2">$85.50</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-blue-800">This Week</h3>
                        <p className="text-2xl font-bold mt-2">$420.75</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-purple-800">This Month</h3>
                        <p className="text-2xl font-bold mt-2">$1,245.00</p>
                    </div>
                </div>
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">Earnings History</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliveries</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {[1, 2, 3, 4, 5].map((day) => (
                                    <tr key={day}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">May {day}, 2023</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{3 + day}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(25 + day * 7).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DriverDashboardLayout>
    );
};

export default EarningsPage;