"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { FaCircle, FaTrashAlt } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import Image, { StaticImageData } from 'next/image';
import mastercard from '../../../../public/images/mastercard.svg';
import Button from '@/app/components/inputs/Button';
import EditPaymentModal from '@/app/components/userdashboardlayout/modal/EditPaymentModal';

const UserPayment: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="w-full bg-appTitleBgColor rounded-lg flex flex-row overflow-hidden border-[1.7px] border-appTitleBgColor">

                <div className="flex w-5/12 p-2 bg-white">
                    <Image
                        className="opacity-95 hover:opacity-90"
                        src={mastercard}
                        alt="mastercard"
                        quality={100}
                        width={150}
                        height={50}
                    />
                </div>
                <div className="flex w-full flex-col bg-appBanner/40 items-start justify-between px-2 py-1">
                    <div className="flex w-full items-center justify-between">
                        <p className='text-white font-semibold text-xs'>Mastercard Ending With ***2468</p>
                        <FaCircle className='text-green-500' />
                    </div>

                    <div className="w-full flex items-buttom justify-end gap-4 px-0 mt-4">

                        <Link href="#" className="flex items-center justify-center bg-green-500 gap-2 py-1 px-2 rounded-sm">
                            <FaTrashAlt className="text-gray-700 text-md cursor-pointer" /> <span className="text-gray-700 font-semibold text-xs"> Delete </span>
                        </Link>

                        <Link href="#" className='flex items-center justify-center bg-green-500 gap-2 py-1 px-2 rounded-sm'>
                            <MdEdit className="text-gray-700 text-md cursor-pointer" /> <span className="text-gray-700 font-semibold text-xs" onClick={openModal}> Edit </span>
                        </Link>

                    </div>
                </div>


            </div>

            <EditPaymentModal isOpen={isModalOpen} onClose={closeModal} />
        </>

    );
}

export default UserPayment;
