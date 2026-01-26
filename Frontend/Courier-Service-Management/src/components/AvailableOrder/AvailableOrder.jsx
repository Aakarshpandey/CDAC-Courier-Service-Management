import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableOrders } from "../../services/users";
import toast from "react-hot-toast";

export default function AvailableOrders() {
  const navigate = useNavigate();
  const [availableOrders, setAvailableOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const resp = await getAvailableOrders();
        if (Array.isArray(resp.data)) {
          setAvailableOrders(resp.data);
        } else {
          setAvailableOrders([]);
        }
      } catch (error) {
        console.error("Error fetching available orders:", error);
        setAvailableOrders([]);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
    // Refresh every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptOrder = (orderId) => {
    navigate("/accept-order", { state: { shipmentId: orderId } });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (availableOrders.length === 0) {
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
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">No Orders Available</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No orders match your pincode area. Orders will appear here when customers in your area place orders.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {availableOrders.map((order) => (
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
                  Pickup: {formatDate(order.createdAt)} • {order.customerName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                ₹{order.calculatedPrice?.toFixed(0) || "0"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {order.distanceKm?.toFixed(1) || "0"} km
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
                {order.pickupPincode && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">Pincode: {order.pickupPincode}</p>
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
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Drop</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{order.deliveryAddress || "N/A"}</p>
                {order.deliveryPincode && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">Pincode: {order.deliveryPincode}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{order.packageType || "Package"}</span>
            <span>•</span>
            <span>{order.weightKg ? `${order.weightKg} kg` : "N/A"}</span>
            {order.vehicleTypeName && (
              <>
                <span>•</span>
                <span>{order.vehicleTypeName}</span>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleAcceptOrder(order.shipmentId)}
              className="flex-1 py-2 px-4 bg-green-600 dark:bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
            >
              Accept Order
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}