import React, { useState, useEffect } from "react";
import { getMyOrders } from "../../services/users";
import { updateOrderStatus } from "../../services/PartnerService";
import toast from "react-hot-toast";

export default function MyOrders() {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState({});

  const loadOrders = async () => {
    try {
      setLoading(true);
      const resp = await getMyOrders();
      if (Array.isArray(resp.data)) {
        // Filter only ASSIGNED and IN_TRANSIT orders
        const activeOrders = resp.data.filter(
          order => order.status === "ASSIGNED" || order.status === "IN_TRANSIT"
        );
        setMyOrders(activeOrders);
      } else {
        setMyOrders([]);
      }
    } catch (error) {
      console.error("Error fetching my orders:", error);
      setMyOrders([]);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // Refresh every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (shipmentId, newStatus) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [shipmentId]: true }));
      const response = await updateOrderStatus(shipmentId, newStatus);
      
      if (response.message) {
        toast.success(response.message);
        // Refresh orders list
        await loadOrders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [shipmentId]: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return "N/A";
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ASSIGNED: {
        bg: "bg-blue-100 dark:bg-blue-900",
        text: "text-blue-800 dark:text-blue-200",
        label: "Assigned"
      },
      IN_TRANSIT: {
        bg: "bg-yellow-100 dark:bg-yellow-900",
        text: "text-yellow-800 dark:text-yellow-200",
        label: "In Transit"
      }
    };

    const config = statusConfig[status] || statusConfig.ASSIGNED;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (myOrders.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
        <svg
          className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">No Active Orders</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You don't have any active orders. Accept orders from the Available Orders tab.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {myOrders.map((order) => (
        <div
          key={order.shipmentId}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">Order #{order.shipmentId}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(order.status)}
              <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-2">
                ₹{order.calculatedPrice?.toFixed(0) || "0"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Pickup</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{order.pickupAddress || "N/A"}</p>
                {order.pickupContactName && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">Contact: {order.pickupContactName}</p>
                )}
                {order.pickupPhone && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">Phone: {order.pickupPhone}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Delivery</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{order.deliveryAddress || "N/A"}</p>
                {order.deliveryContactName && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">Contact: {order.deliveryContactName}</p>
                )}
                {order.deliveryPhone && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">Phone: {order.deliveryPhone}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{order.packageType || "Package"}</span>
            <span>•</span>
            <span>{order.weightKg ? `${order.weightKg} kg` : "N/A"}</span>
            <span>•</span>
            <span>{order.distanceKm?.toFixed(1) || "0"} km</span>
          </div>

          {/* Status Update Buttons */}
          <div className="flex gap-3">
            {order.status === "ASSIGNED" && (
              <button
                onClick={() => handleUpdateStatus(order.shipmentId, "IN_TRANSIT")}
                disabled={updatingStatus[order.shipmentId]}
                className="flex-1 py-2 px-4 bg-yellow-600 dark:bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingStatus[order.shipmentId] ? "Updating..." : "Mark as Picked Up"}
              </button>
            )}
            {order.status === "IN_TRANSIT" && (
              <button
                onClick={() => handleUpdateStatus(order.shipmentId, "DELIVERED")}
                disabled={updatingStatus[order.shipmentId]}
                className="flex-1 py-2 px-4 bg-green-600 dark:bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingStatus[order.shipmentId] ? "Updating..." : "Mark as Delivered"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
