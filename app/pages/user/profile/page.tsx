import React from 'react';
import UserDashboardLayout from '@/app/components/userdashboardlayout/layout/UserDashboardLayout';

const page: React.FC = () => {
    return (
        <UserDashboardLayout>
            <h2 className="text-2xl font-bold">Profile Page</h2>
            <p>Edit your profile information here.</p>
        </UserDashboardLayout>
    );
}
export default page;
