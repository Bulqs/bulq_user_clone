import AdminDashboardLayout from "@/app/components/admindashboard/AdminDashboardLayout";

export default function InventoryPage() {
    return (
        <AdminDashboardLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Inventory</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <p>Inventory management content goes here...</p>
                </div>
            </div>
        </AdminDashboardLayout>

    )
}