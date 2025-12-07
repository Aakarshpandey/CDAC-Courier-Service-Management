import React from "react";

export default function StatsCard({ title, value, icon, iconColor }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div
          className={`w-12 h-12 ${iconColor} bg-opacity-10 rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
