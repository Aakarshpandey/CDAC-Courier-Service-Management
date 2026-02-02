import React, { useState, useEffect } from "react";
import RatingModal from "../RatingModal/RatingModal";
import toast from "react-hot-toast";
import axios from "axios";
import { submitRating } from "../../services/shipments";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const userEmail = localStorage.getItem('userEmail');
      const token = localStorage.getItem('authToken');
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      
      if (!userEmail) {
        console.error("No user email found");
        setOrders([]);
        return;
      }

      const response = await axios.get(`${API_URL}/api/shipments/user?email=${userEmail}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleRateOrder = (order) => {
    setSelectedOrder(order);
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (shipmentId, rating, review) => {
    try {
      const response = await submitRating(shipmentId, rating, review);
      if (response.data.status === "SUCCESS") {
        toast.success(response.data.message || "Rating submitted successfully");
        // Refresh orders to update rating status
        await loadOrders();
      } else {
        toast.error(response.data.message || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error(error.response?.data?.message || "Failed to submit rating");
      throw error;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-800 dark:text-gray-200", label: "Pending" },
      ASSIGNED: { bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-800 dark:text-blue-200", label: "Assigned" },
      IN_TRANSIT: { bg: "bg-yellow-100 dark:bg-yellow-900", text: "text-yellow-800 dark:text-yellow-200", label: "In Transit" },
      DELIVERED: { bg: "bg-green-100 dark:bg-green-900", text: "text-green-800 dark:text-green-200", label: "Delivered" },
      CANCELLED: { bg: "bg-red-100 dark:bg-red-900", text: "text-red-800 dark:text-red-200", label: "Cancelled" }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  if (orders.length === 0) {
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
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">No Orders Yet</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You haven't placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.shipmentId}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  Order #{order.shipmentId}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                {getStatusBadge(order.status)}
                <p className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-2">
                  ₹{order.calculatedPrice?.toFixed(0) || "0"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Pickup</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{order.pickupAddress || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivery</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{order.deliveryAddress || "N/A"}</p>
              </div>
            </div>

            {order.status === "DELIVERED" && !order.hasRating && (
              <button
                onClick={() => handleRateOrder(order)}
                className="w-full py-2 px-4 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Rate Partner
              </button>
            )}

            {order.status === "DELIVERED" && order.hasRating && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>You rated this delivery</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {showRatingModal && selectedOrder && (
        <RatingModal
          shipment={selectedOrder}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedOrder(null);
          }}
          onSubmit={handleSubmitRating}
        />
      )}
    </>
  );
}
