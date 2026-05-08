"use client"
import React from 'react';
import { useState } from 'react';
import UserDashboardLayout from '@/app/components/userdashboardlayout/layout/UserDashboardLayout';


const UserOrder: React.FC = () => {

    const [isOpenFilter, setIsOpenFilter] = useState(false);
    const [selectedValueFilter, setSelectedValueFilter] = useState<string>("Filter By Date");
    const [openDropdownsTable, setOpenDropdownsTable] = useState<Record<string, boolean>>({});

    interface Order {
        orderId: string;
        dateLoaded: string;
        status: string;
        pickUpLocation: string;
        dropOffLocation: string;
    }

    interface Item {
        sn: number;
        itemName: string;
        category: string;
        fragile: boolean;
        quantity: number;
        weight: string;
        shippingType: string;
    }

    const orders: Order[] = [
        {
            orderId: "#ORD001",
            dateLoaded: "2024-09-28",
            status: "In Progress",
            pickUpLocation: "New York",
            dropOffLocation: "Los Angeles",
        },
        {
            orderId: "#ORD002",
            dateLoaded: "2024-09-27",
            status: "Completed",
            pickUpLocation: "Chicago",
            dropOffLocation: "Houston",
        },
        // Add more orders as needed
    ];

    const items: Item[] = [
        { sn: 1, itemName: "Laptop", category: "Electronics", fragile: true, quantity: 1, weight: "1.5kg", shippingType: "Air" },
        { sn: 2, itemName: "Books", category: "Education", fragile: false, quantity: 3, weight: "2kg", shippingType: "Ground" },
        // Add more items as needed
    ];

    const toggleDropdownFilter = () => {
        setIsOpenFilter(!isOpenFilter);
    };


    const handleFilter = (value: string) => {
        setSelectedValueFilter(value);
        setIsOpenFilter(false); // Close the dropdown after selection
    };


    const toggleDropdownSecondTable = (orderId: string) => {
        setOpenDropdownsTable((prevState) => ({
            ...prevState,
            [orderId]: !prevState[orderId],
        }));
    };



    return (
        <>
           
                <div className='flex flex-col  md:items-center mt-2 md:mt-6 w-full shadow-lg shadow-appTitleBgColor '>
                    {/* Chat Stistics Heading Goes Here*/}
                    <div className="flex flex-row w-full items-center justify-between md:px-2 py-1 bg-black">
                        <div className="flex items-center justify-start pl-2 md:px-2 font-bold w-full">
                            <p className='text-white text-[10px] md:text-lg'>ORDER LIST</p>
                        </div>

                        <div className="flex items-center justify-end pt-0 p-2 gap-3 mt-2 w-full">

                            <div className="flex relative flex-wrap p-0 items-center justify-center px-0 rounded-lg">
                                <button
                                    onClick={toggleDropdownFilter}
                                    className="inline-flex justify-between w-24 md:w-44 px-1 md:px-2 py-1 bg-appTitleBgColor text-white font-medium rounded-sm md:rounded-md"
                                >
                                    <p className="value text-[10px] md:text-sm">{selectedValueFilter}</p> {/* Show the selected value here */}
                                    <svg
                                        className="mt-[3px] ml-2 md:-mr-1 md:h-5 h-3 md:w-5 w-3"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 3a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L13 10.414V16a1 1 0 01-.553.894l-4 2A1 1 0 017 18v-7.586L3.293 5.707A1 1 0 013 5V3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isOpenFilter && (
                                    <div className="absolute right-0 mt-[238px] md:mt-[280px] 12 w-28 md:w-44 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="py-0 bg-appTitleBgColor rounded-lg overflow-hidden border-2 border-appNav shadow-lg shadow-appNav">
                                            <button
                                                onClick={() => handleFilter("Filter By Date")}
                                                className="block w-full px-1 md:px-4 py-2 text-[10px] md:text-sm text-white hover:text-appTitleBgColor hover:bg-gray-100 font-medium"
                                            >
                                                Filter By Date
                                            </button>
                                            <button
                                                onClick={() => handleFilter("Filter By Id")}
                                                className="block w-full px-1 md:px-4 py-2 text-[10px] md:text-sm text-white hover:text-appTitleBgColor hover:bg-gray-100 font-medium"
                                            >
                                                Filter By Id
                                            </button>
                                            <button
                                                onClick={() => handleFilter("Filter By Location")}
                                                className="block w-full px-1 md:px-4 py-2 text-[10px] md:text-sm text-white hover:text-appTitleBgColor hover:bg-gray-100 font-medium"
                                            >
                                                Filter By Location
                                            </button>
                                            <button
                                                onClick={() => handleFilter("Filter By State")}
                                                className="block w-full px-1 md:px-4 py-2 text-[10px] md:text-sm text-white hover:text-appTitleBgColor hover:bg-gray-100 font-medium"
                                            >
                                                Filter By State
                                            </button>
                                            <button
                                                onClick={() => handleFilter("Filter By Country")}
                                                className="block w-full px-1 md:px-4 py-2 text-[10px] md:text-sm text-white hover:text-appTitleBgColor hover:bg-gray-100 font-medium"
                                            >
                                                Filter By Country
                                            </button>
                                            <button
                                                onClick={() => handleFilter("Filter By City")}
                                                className="block w-full px-1 md:px-4 py-2 text-[10px] md:text-sm text-white hover:text-appTitleBgColor hover:bg-gray-100 font-medium"
                                            >
                                                Filter By City
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-28 md:w-64 h-6 md:h-8  bg-white border rounded border-gray-700 flex items-center overflow-hidden">
                                <input className="mx-2 focus:outline-none w-full py-2 text-sm leading-none placeholder-gray-600 text-gray-600" placeholder="Search here" />
                                <svg className="mr-2" width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.66667 11.3333C9.244 11.3333 11.3333 9.244 11.3333 6.66667C11.3333 4.08934 9.244 2 6.66667 2C4.08934 2 2 4.08934 2 6.66667C2 9.244 4.08934 11.3333 6.66667 11.3333Z" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 14L10 10" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>


                        </div>

                    </div>
                    {/* Chat Stistics Heading Goes Here*/}

                    <div className="flex w-full items-center justify-between md:px-2 pb-2 mt-3 md:mt-6 overflow-x-scroll md:overflow-x-hidden p-1">
                        <div className="overflow-x-auto w-full">
                            <table className="min-w-full table-auto border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-appTitleBgColor text-center text-white text-[10px] md:text-base">
                                        <th className="border p-2">
                                            <input type="checkbox" />
                                        </th>
                                        <th className="border p-2">Order ID</th>
                                        <th className="border p-2">Date Loaded</th>
                                        <th className="border p-2">Status</th>
                                        <th className="border p-2">Pick Up Location</th>
                                        <th className="border p-2">Drop Off Location</th>
                                        <th className="border p-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <>
                                            <tr key={order.orderId} className="text-center bg-appBanner/80 font-semibold text-[8px] md:text-base">
                                                <th className="border p-2">
                                                    <input type="checkbox" />
                                                </th>
                                                <td className="border px-1 md:p-2">{order.orderId}</td>
                                                <td className="border px-1 md:p-2">{order.dateLoaded}</td>
                                                <td className="border px-0 md:p-2"> <span className="md:bg-green-800 px-0 md:px-3 py-1 rounded-sm md:rounded-lg md:text-white"> {order.status} </span></td>
                                                <td className="border px-1 md:p-2">{order.pickUpLocation}</td>
                                                <td className="border px-1 md:p-2">{order.dropOffLocation}</td>
                                                <td className="border px-1 md:p-2">
                                                    <p
                                                        className="Haction cursor-pointer text-white bg-appTitleBgColor py-1 rounded-lg"
                                                        onClick={() => toggleDropdownSecondTable(order.orderId)}
                                                    >
                                                        {openDropdownsTable[order.orderId] ? "Hide Details" : "View Details"}
                                                    </p>
                                                </td>
                                            </tr>

                                            {/* This is the row that will toggle on clicking */}
                                            {openDropdownsTable[order.orderId] && (
                                                <tr className="w-full">
                                                    <td colSpan={8} className="w-full">

                                                        <div className="bg-gray-50 w-full shadow-md rounded mt-2 mb-4 md:mx-auto overflow-x-scroll md:overflow-x-hidden p-2">
                                                            <table className="w-[70%] md:min-w-full table-auto border-collapse border border-gray-200">
                                                                <thead>
                                                                    <tr className="bg-appNav text-center text-xs text-[7.5px] md:text-base">
                                                                        <th className="border p-2">SN</th>
                                                                        <th className="border p-2">ITEM NAME</th>
                                                                        <th className="border p-2">CATEGORY</th>
                                                                        <th className="border p-2">FRAGILE</th>
                                                                        <th className="border p-2">QUANTITY</th>
                                                                        <th className="border p-2">WEIGHT</th>
                                                                        <th className="border p-2">SHIPPING TYPE</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {items?.map((item) => (
                                                                        <tr key={item.sn} className="text-center bg-appBanner/95 text-white text-[7px] md:text-base">
                                                                            <td className="border p-2">{item.sn}</td>
                                                                            <td className="border p-2">{item.itemName}</td>
                                                                            <td className="border p-2">{item.category}</td>
                                                                            <td className="border p-2">{item.fragile ? "Yes" : "No"}</td>
                                                                            <td className="border p-2">{item.quantity}</td>
                                                                            <td className="border p-2">{item.weight}</td>
                                                                            <td className="border p-2">{item.shippingType}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
        </>
    );
}

export default UserOrder;
