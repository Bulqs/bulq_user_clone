import React from 'react';
import { IoLocationOutline, IoTimeOutline, IoCallOutline, IoCheckmarkCircle } from "react-icons/io5";

interface LocationCardProps {
  title: string;
  location: string;
  address: string;
  workingHours: { day: string; hours: string }[];
  phoneNumbers: string[];
}

const LocationCard: React.FC<LocationCardProps> = ({ title, location, address, workingHours, phoneNumbers }) => {
  return (
    // UPDATED: 'bg-gray-50' (Off-White) reduces glare. 'hover:bg-white' creates focus.
    <div className='group w-full bg-gray-50 border border-gray-100 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:bg-white transition-all duration-300 overflow-hidden cursor-default'>
      
      {/* Header Section */}
      <div className="flex flex-row items-center justify-between p-6 pb-2">
        <div>
            {/* Title remains sharp/dark as requested */}
            <h3 className='font-bold text-gray-900 text-lg tracking-tight'>{title}</h3>
            
            {/* Pill background slightly darker than card to stand out softly */}
            <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-appBanner bg-white border border-gray-100 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
               <IoLocationOutline /> {location}
            </span>
        </div>
        
        {/* Service Tags */}
        <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pick Up</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Delivery</span>
            </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 space-y-6">
        {/* Address Section */}
        <div className="flex items-start gap-4">
            <div className="mt-0.5 p-2 bg-white rounded-lg shadow-sm text-gray-400 border border-gray-100">
                <IoLocationOutline size={18} />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                    {address}
                </p>
            </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gray-200/50"></div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Working Hours */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <IoTimeOutline className="text-appBanner/70" />
                    <h4 className='text-xs font-bold text-gray-500 uppercase tracking-wider'>Hours</h4>
                </div>
                <div className='space-y-2.5'>
                    {workingHours?.map((item, index) => (
                    <div key={index} className='flex text-xs items-center justify-between w-full'>
                        <span className="font-semibold text-gray-500">{item.day}</span>
                        <span className="font-bold text-gray-800">{item.hours}</span>
                    </div>
                    ))}
                </div>
            </div>

            {/* Phone Numbers */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <IoCallOutline className="text-appBanner/70" />
                    <h4 className='text-xs font-bold text-gray-500 uppercase tracking-wider'>Contact</h4>
                </div>
                <div className='space-y-2'>
                    {phoneNumbers?.map((phone, index) => (
                    <p key={index} className='flex items-center gap-3 text-xs font-bold text-gray-700 bg-white border border-gray-100 px-4 py-2.5 rounded-xl shadow-sm hover:border-appBanner/30 transition-colors cursor-pointer'>
                        {phone}
                    </p>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default LocationCard;