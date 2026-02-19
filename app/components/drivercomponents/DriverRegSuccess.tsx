"use client"

import Link from 'next/link';
import React from 'react';

interface DriverRegSuccessProps {
    onClose: () => void;
}

const DriverRegSuccess: React.FC<DriverRegSuccessProps> = ({ onClose }) => {
    return (
        <div className="flex flex-col p-6 text-white">
            <div className="flex flex-col items-center justify-center p-2 text-white">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Registration Submitted Successful!</h2>
                <p className="text-center mb-6"> Thank you for applying to join our logistics network, We have received your information and will review it shortly. Progress will be sent to your provided email</p>
            </div>
           
          
            
            <div className="flex items-center justify-center text-center w-full h-10 bg-appNav  p-4">
                <p className='text-white'> Your registration reference number: "BULQ0346TY55" </p>
            </div>

            <div className="flex items-center justify-start text-center w-full mt-10">
                <h3 className="text-white"> What Happened Next? </h3>
            </div>

            <div className=" space-y-10 flex flex-col items-center justify-star w-full h-auto  p-4">

                <div className="flex flex-row w-full items-center justify-start gap-6">
                    <div className="flex h-12 w-14 rounded-full bg-appNav items-center justify-center">
                        <h3 className="flex font-bold text-white"> 1 </h3>
                    </div>
                    <div className="flex flex-col w-full">
                        <h5 className="font-bold text-white">Application Review</h5>
                        <p className="font-semibold text-white"> Our team will verify your driver's license, vehicle information, and documents, this process typically takes 2-3 business days</p>
                    </div>
                </div>

                <div className="flex flex-row w-full items-center justify-start gap-6">
                    <div className="flex h-12 w-14 rounded-full bg-appNav items-center justify-center">
                        <h3 className="flex font-bold text-white"> 2 </h3>
                    </div>

                    <div className="flex flex-col w-full">
                        <h5 className="font-bold text-white"> Background Check</h5>
                        <p className="font-semibold text-white"> Our team will verify your driver's license, vehicle information, and documents, this process typically takes 2-3 business days</p>
                    </div>
                </div>

                <div className="flex flex-row w-full items-center justify-start gap-6">
                    <div className="flex h-12 w-14 rounded-full bg-appNav items-center justify-center">
                        <h3 className="flex font-bold text-white"> 3 </h3>
                    </div>

                    <div className="flex flex-col w-full">
                        <h5 className="font-bold text-white"> Vehicle Inspection</h5>
                        <p className="font-semibold text-white"> Our team will verify your driver's license, vehicle information, and documents, this process typically takes 2-3 business days</p>
                    </div>
                </div>

                <div className="flex flex-row w-full items-center justify-start gap-6">
                    <div className="flex h-12 w-14 rounded-full bg-appNav items-center justify-center">
                        <h3 className="flex font-bold text-white"> 4 </h3>
                    </div>
                    
                    <div className="flex flex-col w-full">
                        <h5 className="font-bold text-white"> Onboarding </h5>
                        <p className="font-semibold text-white"> Our team will verify your driver's license, vehicle information, and documents, this process typically takes 2-3 business days</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center w-full mt-8">
                <h6 className="text-white"> The entire process takes 5-7 busniess days, We'll keep you updated at every step.  </h6>
            </div>

            <button
                onClick={onClose}
                className="px-6 py-2 bg-appNav rounded-md hover:bg-black transition-colors mt-10"
            ><Link href={`/pages/driver`}></Link>
                Return to Home
            </button>
        </div>
    );
};

export default DriverRegSuccess;