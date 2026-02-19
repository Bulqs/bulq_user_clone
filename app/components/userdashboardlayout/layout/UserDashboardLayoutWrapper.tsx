// components/UserDashboardLayoutWrapper.tsx
import { getUserSession } from "@/lib/utils/utils";
import UserDashboardLayout from "./UserDashboardLayout";
// import { getUserSession } from "@/lib/"; // Example function to get user session

const UserDashboardLayoutWrapper = async ({ children }: { children: React.ReactNode }) => {
    const user = await getUserSession(); // Fetch user data in a Server Component

    return (
        <UserDashboardLayout
            // email={user?.email || ""}
            // firstName={user?.firstName || ""}
            // lastName={user?.lastName || ""}
        >
            {children}
        </UserDashboardLayout>
    );
};

export default UserDashboardLayoutWrapper;
