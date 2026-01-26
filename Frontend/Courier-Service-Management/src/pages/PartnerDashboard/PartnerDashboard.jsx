import React, { useState, useEffect } from "react";
import StatsCard from "../../components/StatsCard/StatsCard";
import TabNavigation from "../../components/TabNavigation/TabNavigation";
import Earning from "../../components/Earning/Earning";
import Navbar from "../../components/NavBar/Navbar";
import AvailableOrders from "../../components/AvailableOrder/AvailableOrder";
import PartnerProfile from "../../components/PartnerProfile/PartnerProfile";
import { getPartnerProfile, getPartnerDashboardStats, updatePartnerOnlineStatus } from "../../services/users";

export default function PageDashboard() {
  const [activeTab, setActiveTab] = useState("available");
  const [partnerProfile, setPartnerProfile] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineUpdating, setOnlineUpdating] = useState(false);

  const fetchPartnerData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No auth token found");
          setLoading(false);
          return;
        }

        const [profileResponse, statsResponse] = await Promise.allSettled([
          getPartnerProfile(),
          getPartnerDashboardStats()
        ]);

        if (profileResponse.status === "fulfilled" && profileResponse.value?.data?.responseStatus === "SUCCESS") {
          setPartnerProfile(profileResponse.value.data);
        } else if (profileResponse.status === "rejected") {
          console.error("Failed to fetch profile:", profileResponse.reason);
        }

        if (statsResponse.status === "fulfilled" && statsResponse.value?.data?.status === "SUCCESS") {
          setDashboardStats(statsResponse.value.data);
        } else if (statsResponse.status === "rejected") {
          console.error("Failed to fetch stats:", statsResponse.reason);
        }
      } catch (error) {
        console.error("Error fetching partner data:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchPartnerData();
  }, []);

  // Refresh profile when returning from edit page
  useEffect(() => {
    const handleFocus = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        fetchPartnerData();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const welcomeName = partnerProfile?.firstName || "Partner";
  const isOnline = !!partnerProfile?.isOnline;

  const handleToggleOnline = async () => {
    if (!partnerProfile) return;
    const next = !isOnline;

    // Optimistic UI update
    setPartnerProfile((prev) => prev ? { ...prev, isOnline: next } : null);
    if (!next && activeTab === "available") {
      setActiveTab("profile");
    }

    try {
      setOnlineUpdating(true);
      const resp = await updatePartnerOnlineStatus(next);
      if (resp?.data?.status === "SUCCESS") {
        setPartnerProfile((prev) => prev ? { ...prev, isOnline: !!resp.data.isOnline } : null);
      } else {
        // rollback
        setPartnerProfile((prev) => prev ? { ...prev, isOnline: !next } : null);
      }
    } catch (e) {
      console.error("Failed to update online status:", e);
      // rollback
      setPartnerProfile((prev) => prev ? { ...prev, isOnline: !next } : null);
    } finally {
      setOnlineUpdating(false);
    }
  };

  const tabs = [
    { 
      id: "available", 
      label: `Available Orders${dashboardStats?.todayOrders !== undefined ? ` (${dashboardStats.todayOrders})` : ''}`,
      disabled: !isOnline
    },
    { id: "earnings", label: "Earnings" },
    { id: "profile", label: "Profile" },
  ];

  const user = partnerProfile 
    ? { name: welcomeName, email: partnerProfile.email, profilePhotoUrl: partnerProfile.profilePhotoUrl }
    : { name: "Partner" };

  // Calculate number of visible cards for responsive grid
  const visibleCardsCount = dashboardStats?.totalDistanceKm != null && dashboardStats.totalDistanceKm > 0 ? 5 : 4;
  const gridCols = visibleCardsCount === 5 ? "grid-cols-5" : "grid-cols-4";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Welcome Section */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              Welcome back, {welcomeName}! 🎉
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isOnline ? "You're online and ready for deliveries" : "You're currently offline"}
            </p>
          </div>

          {/* Online Toggle */}
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${isOnline ? "text-green-700 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}`}>
              {isOnline ? "Online" : "Offline"}
            </span>
            <button
              type="button"
              onClick={handleToggleOnline}
              disabled={loading || onlineUpdating || !partnerProfile}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isOnline ? "bg-green-600 dark:bg-green-500" : "bg-gray-300 dark:bg-gray-600"
              }`}
              aria-pressed={isOnline}
              aria-label="Toggle online status"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white dark:bg-gray-200 transition-transform ${
                  isOnline ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className={`grid ${gridCols} gap-4 mb-6`}>
              <StatsCard
                title="Orders Today"
                value={dashboardStats?.todayOrders?.toString() || "0"}
                icon={
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                }
                iconColor="text-blue-600 dark:text-blue-400"
              />
              <StatsCard
                title="Earnings"
                value={dashboardStats?.todayEarnings 
                  ? `₹${dashboardStats.todayEarnings.toFixed(0)}` 
                  : "₹0"}
                icon={
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                iconColor="text-green-600 dark:text-green-400"
              />
              {/* Only show Distance if partner has orders */}
              {dashboardStats?.totalDistanceKm != null && dashboardStats.totalDistanceKm > 0 && (
                <StatsCard
                  title="Distance"
                  value={`${dashboardStats.totalDistanceKm.toFixed(0)} km`}
                  icon={
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  }
                  iconColor="text-purple-600 dark:text-purple-400"
                />
              )}
              <StatsCard
                title="Rating"
                value={dashboardStats?.avgRating 
                  ? dashboardStats.avgRating.toFixed(1) 
                  : "0.0"}
                icon={
                  <svg className="w-6 h-6 text-yellow-500 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                }
                iconColor="text-yellow-500 dark:text-yellow-400"
              />
              <StatsCard
                title="Completed"
                value={dashboardStats?.completedDeliveries?.toString() || "0"}
                icon={
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                iconColor="text-orange-600 dark:text-orange-400"
              />
            </div>
          </>
        )}

        {/* Tab Navigation */}
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "available" && (
            isOnline ? (
              <AvailableOrders />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">You're offline</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Go online to view and accept current orders.
                </p>
                <button
                  type="button"
                  onClick={handleToggleOnline}
                  disabled={onlineUpdating}
                  className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  Go Online
                </button>
              </div>
            )
          )}
          {activeTab === "earnings" && (
            <Earning dashboardStats={dashboardStats} />
          )}
          {activeTab === "profile" && (
            <PartnerProfile partnerData={partnerProfile} />
          )}
        </div>
      </div>
    </div>
  );
}
