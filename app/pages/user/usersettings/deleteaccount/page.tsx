"use client"
import { useState } from 'react';
import UserDashboardLayout from '@/app/components/userdashboardlayout/layout/UserDashboardLayout';
import React from 'react';

const page = () => {

   // State to manage the modal visibility and reason
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle the delete button click (open modal)
  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  // Handle the confirmation modal form submission
  const handleConfirmDelete = async () => {
    if (!selectedReason) {
      alert('Please select a reason for account deletion.');
      return;
    }

    setIsSubmitting(true);

    // Simulate the delete action (API call, etc.)
    try {
      // Replace with your delete account logic
      console.log('Account deleted with reason:', selectedReason);
      alert('Your account has been deleted.');

      // Close the modal and reset states
      setIsModalOpen(false);
      setSelectedReason('');
    } catch (error) {
      alert('An error occurred while deleting your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close (without deletion)
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
      <UserDashboardLayout>
          <h1 className="text-2xl font-bold mb-4 text-black">Delete User Account</h1>
      <p>Delete Account Action.</p>
      
      <div className="flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 mt-36">
          <h1 className="text-2xl font-semibold mb-4 text-black">Delete Your Account</h1>
          <p className="mb-6">
            We’re sorry to see you go! If you’re sure you want to delete your account, click the button below.
          </p>
          <button
            onClick={handleDeleteClick}
            className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete Account
          </button>
        </div>

        {/* Confirmation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4 text-black">Confirm Account Deletion</h2>
              <p className="mb-4">
                Please select a reason for deleting your account:
              </p>

              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              >
                <option value="">Select a reason</option>
                <option value="Not satisfied with the service">Not satisfied with the service</option>
                <option value="Privacy concerns">Privacy concerns</option>
                <option value="Found a better alternative">Found a better alternative</option>
                <option value="Other">Other</option>
              </select>

              <div className="flex justify-between">
                <button
                  onClick={handleCancel}
                  className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isSubmitting}
                  className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Deleting...' : 'Confirm Deletion'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </UserDashboardLayout>
  );
}

export default page;
