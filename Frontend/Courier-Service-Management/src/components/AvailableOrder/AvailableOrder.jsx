import React from "react";
import { useNavigate } from "react-router-dom";
export default function AvailableOrders() {

  const navigate = useNavigate();
  const availableOrders = [
    {
      id: "PCK202410003",
      pickupTime: "2:30 PM",
      pickup: "Connaught Place, Delhi",
      drop: "Sector 18, Noida",
      category: "Electronics",
      weight: "1.5 kg",
      amount: 185,
      distance: 28,
    },
    {
      id: "PCK202410004",
      pickupTime: "3:15 PM",
      pickup: "Khan Market, Delhi",
      drop: "MG Road, Gurgaon",
      category: "Document",
      weight: "0.5 kg",
      amount: 155,
      distance: 22,
    },
  ];

  const handleAcceptOrder = (orderId) => {
    console.log("Accepting order:", orderId);
    // Add your order acceptance logic here
    navigate("/accept-order");
  };

  const handleViewRoute = (orderId) => {
    console.log("Viewing route for order:", orderId);
    // Add your route viewing logic here
  };

  return (
    <div className="space-y-4">
      {availableOrders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
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
                <p className="font-semibold text-gray-800">Order #{order.id}</p>
                <p className="text-sm text-gray-500">Pickup: {order.pickupTime}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-600">₹{order.amount}</p>
              <p className="text-sm text-gray-500">{order.distance} km</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-green-600 mt-0.5"
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
                <p className="text-sm font-medium text-gray-800">Pickup</p>
                <p className="text-sm text-gray-600">{order.pickup}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-red-600 mt-0.5"
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
                <p className="text-sm font-medium text-gray-800">Drop</p>
                <p className="text-sm text-gray-600">{order.drop}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <span>{order.category}</span>
            <span>•</span>
            <span>{order.weight}</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleAcceptOrder(order.id)}
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Accept Order
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}