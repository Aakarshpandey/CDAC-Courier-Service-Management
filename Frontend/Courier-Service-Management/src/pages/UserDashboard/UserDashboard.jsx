import React, { useState } from 'react';
import { Plus, Search, Navigation, Phone, MessageCircle, Clock, MapPin, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/NavBar/Navbar';

const UserDashboard = () => {
  const [activeTracking, setActiveTracking] = useState(true);

  const navigate = useNavigate();
  const user = { name: "Rohan Sharma" }
  // Mock data
  const deliveryData = {
    orderId: 'CK001234',
    eta: '25 mins',
    status: 'In Transit',
    from: {
      location: 'Connaught Place, New Delhi',
    },
    to: {
      location: 'Sector 62, Noida, Uttar Pradesh',
    },
    currentLocation: 'On NH-24, Near Akshardham',
    partner: {
      name: 'Rajesh Kumar',
      vehicle: 'Honda Activa (DL-1234)',
      rating: 4.8
    },
    progress: [
      { status: 'Order Confirmed', time: '2:30 PM', completed: true },
      { status: 'Package Picked Up', time: '3:15 PM', completed: true },
      { status: 'Out for Delivery', time: '3:45 PM', completed: true },
      { status: 'Arriving Soon', time: '4:20 PM', completed: false }
    ]
  };

  activeTracking
  setActiveTracking

  const recentDeliveries = [
    { id: 'CK001233', amount: '₹450', date: 'Yesterday' },
    { id: 'CK001232', amount: '₹320', date: '2 days ago' },
    { id: 'CK001231', amount: '₹580', date: '3 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
  <Navbar user={user} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Rahul! 👋
          </h1>
          <p className="text-gray-600">Track your packages and manage your deliveries</p>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button  onClick={() => navigate("/booking-details")} className="bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
            <Plus size={20} />
            Send New Package
          </button>
          <button onClick={() => navigate("/track-package")} className="bg-white text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2 border-2 border-gray-200">
            <Search size={20} />
            Track Package
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Live Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Tracking Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Navigation className="text-blue-600" size={20} />
                <h2 className="text-xl font-semibold text-gray-900">Live Tracking</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">Real-time location of your delivery</p>

              {/* Map Placeholder with Icon */}
              <div className="bg-gray-100 rounded-lg p-12 mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="text-blue-600" size={40} />
                  </div>
                  <p className="text-gray-600 font-medium">Map View</p>
                </div>
              </div>

              {/* Order Info on Map */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order: {deliveryData.orderId}</p>
                    <p className="text-xs text-gray-600">ETA: {deliveryData.eta}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    Delivery
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-0.5 h-12 bg-gray-300 my-1"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 space-y-8">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">From</p>
                      <p className="text-sm font-medium text-gray-900">{deliveryData.from.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">To</p>
                      <p className="text-sm font-medium text-gray-900">{deliveryData.to.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Location */}
              <div className="flex items-start gap-2 bg-green-50 p-3 rounded-lg">
                <MapPin className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Current Location</p>
                  <p className="text-xs text-gray-600">{deliveryData.currentLocation}</p>
                </div>
              </div>
            </div>

            {/* Recent Deliveries */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Deliveries</h2>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
              </div>
              <p className="text-sm text-gray-600 mb-6">Your delivery history</p>

              <div className="space-y-3">
                {recentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Package className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{delivery.id}</p>
                        <p className="text-sm text-gray-600">{delivery.date}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">{delivery.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Delivery Details */}
          <div className="space-y-6">
            {/* Delivery Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Delivery Details</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="font-semibold text-gray-900">{deliveryData.orderId}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    {deliveryData.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Estimated Arrival</p>
                  <div className="flex items-center gap-2 text-green-600">
                    <Clock size={16} />
                    <span className="font-semibold">{deliveryData.eta}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Delivery Route</p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">From</p>
                        <p className="text-sm text-gray-900">{deliveryData.from.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">To</p>
                        <p className="text-sm text-gray-900">{deliveryData.to.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Partner Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Your Delivery Partner</h3>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  RK
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{deliveryData.partner.name}</p>
                  <p className="text-sm text-gray-600">{deliveryData.partner.vehicle}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium text-gray-900">{deliveryData.partner.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium">
                  <Phone size={18} />
                  Call Partner
                </button>
              </div>
            </div>

            {/* Delivery Progress Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Delivery Progress</h3>

              <div className="space-y-4">
                {deliveryData.progress.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.completed ? 'bg-green-600' : 'bg-blue-600'
                    }`}>
                      {item.completed ? (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${item.completed ? 'text-gray-900' : 'text-blue-600'}`}>
                        {item.status}
                      </p>
                      <p className="text-sm text-gray-600">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;