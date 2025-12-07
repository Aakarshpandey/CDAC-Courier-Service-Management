import React, { useState } from "react";
import Navbar from "../../components/NavbarPartner/Navbar";
import StatsCard from "../../components/StatsCard/StatsCard";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import Earning from "../../components/Earning/Earning";

export default function PageDashboard() {
  const [activeTab, setActiveTab] = useState("available");

  const tabs = [
    { id: "available", label: "Available Orders (2)" },
    { id: "active", label: "Active Deliveries (1)" },
    { id: "earnings", label: "Earnings" },
    { id: "profile", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Welcome back, Amit! 🎉
          </h1>
          <p className="text-gray-600">You're online and ready for deliveries</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <StatsCard
            title="Orders Today"
            value="8"
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Earnings"
            value="₹1,240"
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            iconColor="text-green-600"
          />
          <StatsCard
            title="Distance"
            value="156 km"
            icon={
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            }
            iconColor="text-purple-600"
          />
          <StatsCard
            title="Rating"
            value="4.9"
            icon={
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            }
            iconColor="text-yellow-500"
          />
          <StatsCard
            title="Online Time"
            value="7h 30m"
            icon={
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            iconColor="text-orange-600"
          />
        </div>

        {/* Tab Navigation */}
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "available" && (
            <div>
              {/* Available Orders content goes here */}
            </div>
          )}
          {activeTab === "active" && (
            <div>
              {/* Active Deliveries content goes here */}
            </div>
          )}
          {activeTab === "earnings" && (
            <Earning />
          )}
          {activeTab === "profile" && (
            <div>
              {/* Profile content goes here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
