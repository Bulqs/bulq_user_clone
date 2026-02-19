import React from 'react';
import UserDashboardLayout from '@/app/components/userdashboardlayout/layout/UserDashboardLayout';

const UserNotificationPage: React.FC = () => {
  return (
      <UserDashboardLayout>
          <h2 className="text-2xl font-bold mb-4">Notifications</h2>
          <p>This is the notifications page.</p>
      </UserDashboardLayout>
  );
}

export default UserNotificationPage;
