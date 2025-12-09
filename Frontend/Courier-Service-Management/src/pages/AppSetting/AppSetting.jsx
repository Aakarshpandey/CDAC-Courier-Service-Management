import React, { useState } from "react";

export default function AppSettings() {
  const [settings, setSettings] = useState({
    vehicleType: "BIKE",
    baseFare: "60",
    pricePerKm: "12",
  });

  const handleInputChange = (field, value) => {
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
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pricing Rules</h2>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Vehicle Type */}
          <div className="flex items-center gap-8">
            <label className="w-48 text-gray-700 font-medium">
              Vehicle Type
            </label>
            <select
              value={settings.vehicleType}
              onChange={(e) => handleInputChange("vehicleType", e.target.value)}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="BIKE">BIKE</option>
              <option value="SCOOTER">SCOOTER</option>
              <option value="CAR">CAR</option>
              <option value="VAN">VAN</option>
            </select>
          </div>

          {/* Base Fare */}
          <div className="flex items-center gap-8">
            <label className="w-48 text-gray-700 font-medium">
              Base Fare
            </label>
            <input
              type="number"
              value={settings.baseFare}
              onChange={(e) => handleInputChange("baseFare", e.target.value)}
              placeholder="60"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Price per kilometer */}
          <div className="flex items-center gap-8">
            <label className="w-48 text-gray-700 font-medium">
              Price per kilometer
            </label>
            <input
              type="number"
              value={settings.pricePerKm}
              onChange={(e) => handleInputChange("pricePerKm", e.target.value)}
              placeholder="12"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
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