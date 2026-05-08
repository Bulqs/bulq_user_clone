"use client"
import Button from '@/app/components/inputs/Button';
import UserDashboardLayout from '@/app/components/userdashboardlayout/layout/UserDashboardLayout';
import React from 'react';
import { useState, useRef } from "react";
import { LuSaveAll } from "react-icons/lu";
import { HiOutlineUpload } from "react-icons/hi";
import Image from 'next/image';



const page = () => {

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    country: "",
    city: "",
    address1: "",
    address2: "",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle image delete
  const handleDeleteImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Perform server communication or API calls here
  };



  return (
    <UserDashboardLayout>
      <h1 className="text-2xl font-bold mb-4 text-black">Profile Settings</h1>
      <p> Update Profile</p>

      <div className="w-full max-w-3xl p-4">
        
        {/* Image Upload Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4 text-black">Profile Image</h2>
          <div className="flex items-center space-x-4">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center text-black justify-center">
                  <span className="text-black">No Image</span>
              </div>
            )}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center px-4 py-2 bg-appNav hover:bg-appNav/80 text-white rounded-lg shadow font-semibold gap-3"
              >
                <HiOutlineUpload /> Upload
              </button>

              
              {profileImage && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Details Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-lg font-medium mb-4 text-black">User Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="text"
              name="address1"
              placeholder="Address 1"
              value={formData.address1}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full"
            />
            <input
              type="text"
              name="address2"
              placeholder="Address 2"
              value={formData.address2}
              onChange={handleInputChange}
              className="border rounded-lg p-2 w-full"
            />
          </div>
          

          <Button className='bg-appNav/70 hover:bg-appNav/80 flex justify-center items-center' type="submit">
            <p className=" flex justify-center items-center gap-1 md:gap-3 ">
              <LuSaveAll className="text-xl" /> <span className=""> Save Changes </span>
            </p>
          </Button>

        </form>
      </div>
    </UserDashboardLayout>
  );
}

export default page;
