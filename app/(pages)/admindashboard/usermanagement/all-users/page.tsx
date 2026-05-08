import AdminDashboardLayout from "@/app/components/admindashboard/AdminDashboardLayout";

export default function AllUsersPage() {
    return (
        <AdminDashboardLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">All Users</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <p>All users content goes here...</p>
                </div>
            </div>
        </AdminDashboardLayout>
    )
}