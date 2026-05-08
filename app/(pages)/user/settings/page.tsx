import React from 'react';
import UserDashboardLayout from '@/app/components/userdashboardlayout/layout/UserDashboardLayout';

const page: React.FC = () => {
  return (
      <UserDashboardLayout>
          <h2 className="text-2xl font-bold">Settings Page</h2>
          <p>Adjust your settings here.</p>
      </UserDashboardLayout>
  );
}

export default page;
