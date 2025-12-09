import React, { useState } from "react";

export default function PartnerAppSettings() {
  const [settings, setSettings] = useState({
    notifications: true,
    soundAlerts: true,
    autoAcceptOrders: false,
    showEarnings: true,
    language: "English",
    mapProvider: "Google Maps",
    theme: "Light",
  });

  const handleToggle = (field) => {
    setSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSelect = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Settings saved:", settings);
    // Add your save logic here
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">App Settings</h2>

      <div className="space-y-6">
        {/* Notifications & Alerts */}
        {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Notifications & Alerts
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Push Notifications</p>
                <p className="text-sm text-gray-600">
                  Receive notifications for new orders and updates
                </p>
              </div>
              <button
                onClick={() => handleToggle("notifications")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.notifications ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.notifications ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Sound Alerts</p>
                <p className="text-sm text-gray-600">
                  Play sound when new orders arrive
                </p>
              </div>
              <button
                onClick={() => handleToggle("soundAlerts")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.soundAlerts ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.soundAlerts ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Order Preferences */}
        {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Order Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Auto Accept Orders</p>
                <p className="text-sm text-gray-600">
                  Automatically accept orders matching your preferences
                </p>
              </div>
              <button
                onClick={() => handleToggle("autoAcceptOrders")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.autoAcceptOrders ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.autoAcceptOrders ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Show Earnings</p>
                <p className="text-sm text-gray-600">
                  Display earnings on dashboard
                </p>
              </div>
              <button
                onClick={() => handleToggle("showEarnings")}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.showEarnings ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.showEarnings ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            App Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-800 mb-1">Language</p>
                <p className="text-sm text-gray-600">
                  Choose your preferred language
                </p>
              </div>
              <select
                value={settings.language}
                onChange={(e) => handleSelect("language", e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-800 mb-1">Map Provider</p>
                <p className="text-sm text-gray-600">
                  Select navigation map provider
                </p>
              </div>
              <select
                value={settings.mapProvider}
                onChange={(e) => handleSelect("mapProvider", e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Google Maps">Google Maps</option>
                <option value="Apple Maps">Apple Maps</option>
                <option value="Mapbox">Mapbox</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-800 mb-1">Theme</p>
                <p className="text-sm text-gray-600">
                  Choose app appearance
                </p>
              </div>
              <select
                value={settings.theme}
                onChange={(e) => handleSelect("theme", e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
                <option value="Auto">Auto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}