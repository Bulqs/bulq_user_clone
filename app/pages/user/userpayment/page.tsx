"use client"
import React, { useState } from 'react';
import UserPayment from './UserPayment';
import UserDashboardLayout from '@/app/components/userdashboardlayout/layout/UserDashboardLayout';
import PaymentModal from '@/app/components/userdashboardlayout/modal/PaymentModal';
import { AiFillPlusSquare } from 'react-icons/ai';

const page = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };



  return (
    <UserDashboardLayout>
      
      <div className="flex flex-col w-full">
        <div className="flex flex-row items-center justify-between bg-gray-800 px-2 py-1 mb-4 rounded-md">
          <h2 className="text-sm md:text-xl font-bold text-white p-1">ADD PAYMENT CARD</h2>
          <div className=" p-1 md:p-2 cursor-pointer bg-appTitleBgColor flex items-center justify-end gap-2">
            <span> <AiFillPlusSquare className='text-xs md:text-xl text-white' /> </span> <span className="font-semibold text-xs md:text-base text-white Address" onClick={openModal}> Add New Card </span>
          </div>
        </div>

        <div className="flex flex-row flex-wrap items-start justify-start gap-x-14 gap-y-4 md:grid md:grid-cols-3">
          <UserPayment />  <UserPayment /> <UserPayment /> <UserPayment />
        </div>

      </div>

      {/* Modal component */}
      <PaymentModal isOpen={isModalOpen} onClose={closeModal} />

    </UserDashboardLayout>
  );
}

export default page;
