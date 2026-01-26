import React from "react";

export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
          disabled={tab.disabled}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          } ${tab.disabled ? "opacity-50 cursor-not-allowed hover:text-gray-600 dark:hover:text-gray-400" : ""}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
