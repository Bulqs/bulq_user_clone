import UserDashboardLayout from '@/app/components/userdashboardlayout/layout/UserDashboardLayout';
import React from 'react';

const page = () => {
  return (
      <UserDashboardLayout>
          <h1 className="text-2xl font-bold mb-4 text-black">Notification</h1>
          <p>Update your notification.</p>
      </UserDashboardLayout>
  );
}

export default page;
