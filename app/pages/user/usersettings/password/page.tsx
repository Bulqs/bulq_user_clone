"use client"
import React, { useState } from "react";
import UserDashboardLayout from '@/app/components/userdashboardlayout/layout/UserDashboardLayout';
import Button from "@/app/components/inputs/Button";
import Link from "next/link";
import { GrUpdate } from "react-icons/gr";

const ChangePassword: React.FC = () => {

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your logic for updating the password, e.g., API call
        if (formData.newPassword !== formData.confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }
        console.log("Password updated:", formData);
    };

    const handleCancel = () => {
        // Reset form or redirect to another page
        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    return (
        <UserDashboardLayout>
            <h1 className="text-2xl font-bold mb-4 text-black">Change Your Password</h1>
            <p>Update your password here.</p>

            <div className=" flex items-center px-2 py-4 mt-8">
                <form
                    onSubmit={handleUpdatePassword}
                    className="w-full flex flex-col bg-white rounded-2xl shadow-md p-6 space-y-4"
                >
                    <div className="grid grid-cols-3 gap-6 w-full items-center justify-start">
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600">
                                Current Password
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter current password"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter new password"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                    </div>
                    <div className="w-2/4 flex items-center justify-between space-x-4">
                        {/* <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
                        >
                            Update Password
                        </button> */}

                        <Button className='bg-appNav/70 hover:bg-appNav/80 w-full flex justify-center items-center' type="submit">
                            <p className=" flex justify-center items-center gap-1 md:gap-3 ">
                                <GrUpdate className="text-xl" /> <span className=""> Update Password </span>
                            </p>
                        </Button>

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-full bg-red-800 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:ring-4 focus:ring-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

        </UserDashboardLayout>
    );
}

export default ChangePassword;