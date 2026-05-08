import React from 'react';
import { useState } from 'react';
import UserOrder from './UserOrder';
import UserDashboardLayout from '@/app/components/userdashboardlayout/layout/UserDashboardLayout';


const page: React.FC = () => {



  return (
    <UserDashboardLayout>
      {/* <div className="flex items-start justify-start w-full">
        <UserOrder />
      </div> */}

      <div className="w-full">
        <div className="flex flex-row items-center justify-start bg-gray-800 px-2 py-1 mb-4 rounded-md">
          <h2 className="text-sm md:text-xl font-bold text-white p-1">USER ORDER LIST</h2>
        </div>

        <div className="flex flex-wrap items-start justify-start sm:gap-x-3 lg:gap-x-9 gap-y-4">
          <UserOrder />
        </div>

      </div>
    </UserDashboardLayout>
  );
}

export default page;
