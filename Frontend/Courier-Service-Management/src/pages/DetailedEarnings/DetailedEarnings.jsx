import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/NavBar/Navbar";

export default function DetailedEarnings() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const adminUser = { name: "Amit" };

  // Sample earnings data
  const earningsData = {
    week: {
      total: 7860,
      orders: 52,
      bonus: 500,
      breakdown: [
        { date: "Mon, Dec 4", orders: 8, earnings: 1240 },
        { date: "Tue, Dec 5", orders: 7, earnings: 1050 },
        { date: "Wed, Dec 6", orders: 9, earnings: 1380 },
        { date: "Thu, Dec 7", orders: 6, earnings: 920 },
        { date: "Fri, Dec 8", orders: 10, earnings: 1520 },
        { date: "Sat, Dec 9", orders: 8, earnings: 1150 },
        { date: "Sun, Dec 10", orders: 4, earnings: 600 },
      ],
    },
    month: {
      total: 32450,
      orders: 218,
      bonus: 2000,
      breakdown: [
        { date: "Week 1", orders: 54, earnings: 8120 },
        { date: "Week 2", orders: 52, earnings: 7860 },
        { date: "Week 3", orders: 58, earnings: 8740 },
        { date: "Week 4", orders: 54, earnings: 7730 },
      ],
    },

  };

  const currentData = earningsData[selectedPeriod];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={adminUser} />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/partner-dashboard")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Detailed Earnings
            </h1>
            <p className="text-gray-600">
              Complete breakdown of your earnings
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setSelectedPeriod("week")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              selectedPeriod === "week"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedPeriod("month")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              selectedPeriod === "month"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            This Month
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm opacity-90">Total Earnings</span>
            </div>
            <p className="text-4xl font-bold">₹{currentData.total.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-6 h-6"
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
              <span className="text-sm opacity-90">Total Orders</span>
            </div>
            <p className="text-4xl font-bold">{currentData.orders}</p>
          </div>
        </div>

        {/* Earnings Breakdown Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Earnings Breakdown
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Detailed view of your earnings over time
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Period
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Orders Completed
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Earnings
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Avg per Order
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.breakdown.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.orders}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      ₹{item.earnings.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ₹{Math.round(item.earnings / item.orders)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    Total
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    {currentData.orders}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    ₹{currentData.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    ₹{Math.round(currentData.total / currentData.orders)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Performance Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average per Day</span>
                <span className="font-semibold text-gray-800">
                  ₹{Math.round(currentData.total / currentData.breakdown.length)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Orders per Day</span>
                <span className="font-semibold text-gray-800">
                  {Math.round(currentData.orders / currentData.breakdown.length)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Best Day</span>
                <span className="font-semibold text-green-600">
                  ₹{Math.max(...currentData.breakdown.map(d => d.earnings))}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              Earnings Insights
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Base Earnings</span>
                <span className="font-semibold text-gray-800">
                  ₹{(currentData.total - currentData.bonus).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bonus</span>
                <span className="font-semibold text-green-600">
                  ₹{currentData.bonus.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bonus %</span>
                <span className="font-semibold text-purple-600">
                  {((currentData.bonus / currentData.total) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
