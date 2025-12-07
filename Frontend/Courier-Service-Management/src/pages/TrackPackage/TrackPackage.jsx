import React, { useState } from 'react';
import { Search, Phone, AlertCircle, MessageCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/NavBar/Navbar';

export default function TrackPackage() {
  const [trackingId, setTrackingId] = useState('');

  const handleTrack = () => {
    // Tracking functionality to be added later
    console.log('Tracking ID:', trackingId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar page = "home"/>
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Package
          </h1>
          <p className="text-lg text-gray-600">
            Enter your tracking ID to get real-time updates on your delivery
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Search className="text-blue-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Track Package</h2>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Enter your tracking ID (e.g., CK2024010001)
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tracking ID
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter your tracking ID"
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleTrack}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
              >
                Track Package
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Can't find your package or have questions about your delivery?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Call Support */}
            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Support</h3>
              <p className="text-gray-600 text-sm">1800-123-4567</p>
            </div>

            {/* Report Issue */}
            <div className="border border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-md transition-all cursor-pointer text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Report Issue</h3>
              <p className="text-gray-600 text-sm">Package missing?</p>
            </div>

            {/* Live Chat */}
            <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="text-purple-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 text-sm">Chat with us</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}