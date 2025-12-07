import React from "react";

export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-white text-gray-800 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
