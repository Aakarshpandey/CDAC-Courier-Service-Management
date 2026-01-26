import React from "react";
import { useNavigate } from "react-router-dom";

export default function Profile({ partnerData }) {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const profileData = partnerData ? {
    name: `${partnerData.firstName || ''} ${partnerData.lastName || ''}`.trim() || 'Partner',
    partnerId: partnerData.partnerId ? `PCK${partnerData.partnerId}` : "N/A",
    rating: partnerData.avgRating ? partnerData.avgRating.toFixed(1) : "0.0",
    phone: partnerData.phoneNumber || "N/A",
    email: partnerData.email || "N/A",
    vehicle: partnerData.vehicleTypeName || "N/A",
    vehicleModel: partnerData.vehicleModel || "N/A",
    vehicleRegNumber: partnerData.vehicleRegNumber || "N/A",
    joined: partnerData.createdAt || "N/A",
    profilePhotoUrl: partnerData.profilePhotoUrl || null,
  } : {
    name: "Loading...",
    partnerId: "N/A",
    rating: "0.0",
    phone: "N/A",
    email: "N/A",
    vehicle: "N/A",
    vehicleModel: "N/A",
    vehicleRegNumber: "N/A",
    joined: "N/A",
    profilePhotoUrl: null,
  };
  const navigate = useNavigate();

  const handleEditProfile = () => {
    console.log("Edit Profile clicked");
    // Add your edit profile logic here
    navigate("/partner-edit-profile");
  };

  const handleAppSettings = () => {
    console.log("App Settings clicked");
    // Add your app settings logic here
    navigate("/partner-app-setting");
  };

  const handleNotificationSettings = () => {
    console.log("Notification Settings clicked");
    // Add your notification settings logic here
  };

  const handlePaymentSettings = () => {
    console.log("Payment Settings clicked");
    // Add your payment settings logic here
  };

  const handleSupportHelp = () => {
    console.log("Support & Help clicked");
    // Add your support & help logic here
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Profile Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Profile Information</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Your account details</p>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            {profileData.profilePhotoUrl ? (
              <img
                src={profileData.profilePhotoUrl.startsWith("http") ? profileData.profilePhotoUrl : `${API_URL}${profileData.profilePhotoUrl}`}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
              />
            ) : (
              <span className="text-white text-2xl font-semibold">
                {(partnerData?.firstName?.[0] || "P")}
                {(partnerData?.lastName?.[0] || "")}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">{profileData.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Partner ID: {profileData.partnerId}</p>
            <div className="flex items-center gap-1 mt-1">
              <svg
                className="w-4 h-4 text-yellow-500 dark:text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">{profileData.rating} Rating</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Phone:</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{profileData.phone}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{profileData.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Vehicle:</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {profileData.vehicle} • {profileData.vehicleModel}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Registration No:</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{profileData.vehicleRegNumber}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Joined:</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{profileData.joined}</span>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Account Settings</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your preferences</p>

        <div className="space-y-3">
          <button
            onClick={handleEditProfile}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Edit Profile</span>
          </button>

          <button
            onClick={handleAppSettings}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">App Settings</span>
          </button>

          <button
            onClick={handlePaymentSettings}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Payment Settings</span>
          </button>

        </div>
      </div>
    </div>
  );
}