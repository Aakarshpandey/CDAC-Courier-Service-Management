import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, MapPin, Clock, ChevronRight, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/NavBar/Navbar';

const UserDashboard = () => {
  const navigate = useNavigate();

  const [shipments, setShipments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserShipments();
  }, []);

  const fetchUserShipments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/api/shipments/user");
      setShipments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError('Failed to load shipments');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-700';
      case 'IN_TRANSIT':
        return 'bg-purple-100 text-purple-700';
      case 'DELIVERED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Separate current (active) and completed orders
  const currentOrders = shipments.filter(s =>
    ['PENDING', 'ASSIGNED', 'IN_TRANSIT'].includes(s.status?.toUpperCase())
  );
  const completedOrders = shipments.filter(s =>
    ['DELIVERED', 'CANCELLED'].includes(s.status?.toUpperCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">Track your packages and manage your deliveries</p>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate("/booking-details")}
            className="bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            <Plus size={20} />
            Send New Package
          </button>
          <button
            onClick={() => navigate("/track-package")}
            className="bg-white text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2 border-2 border-gray-200"
          >
            <Search size={20} />
            Track Package
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Current Orders */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Orders Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="text-blue-600" size={20} />
                  <h2 className="text-xl font-semibold text-gray-900">Current Orders</h2>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {currentOrders.length} Active
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-6">Click on an order to view details and track</p>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="animate-spin text-blue-600" size={32} />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                  <button
                    onClick={fetchUserShipments}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : currentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-500 mb-4">No active orders</p>
                  <button
                    onClick={() => navigate("/booking-details")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Send a new package
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentOrders.map((order) => (
                    <div
                      key={order.shipmentId}
                      onClick={() => navigate(`/order/${order.shipmentId}`)}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border-2 border-transparent transition cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">Order #{order.shipmentId}</p>
                          <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status?.replace('_', ' ')}
                          </span>
                          <ChevronRight className="text-gray-400" size={20} />
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <p className="text-xs text-gray-500">From</p>
                            <p className="text-sm text-gray-900 truncate">{order.pickupAddress || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">To</p>
                            <p className="text-sm text-gray-900 truncate">{order.deliveryAddress || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{order.calculatedPrice}</p>
                          <p className="text-xs text-gray-500">{order.vehicleType}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Deliveries</h2>
                <span className="text-sm text-gray-500">{completedOrders.length} completed</span>
              </div>

              {completedOrders.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No completed deliveries yet</p>
              ) : (
                <div className="space-y-3">
                  {completedOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.shipmentId}
                      onClick={() => navigate(`/order/${order.shipmentId}`)}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          order.status === 'DELIVERED' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <Package className={order.status === 'DELIVERED' ? 'text-green-600' : 'text-red-600'} size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.shipmentId}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{order.calculatedPrice}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="text-blue-600" size={20} />
                    </div>
                    <span className="text-gray-700">Active Orders</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{currentOrders.length}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Package className="text-green-600" size={20} />
                    </div>
                    <span className="text-gray-700">Delivered</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {shipments.filter(s => s.status === 'DELIVERED').length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Package className="text-red-600" size={20} />
                    </div>
                    <span className="text-gray-700">Cancelled</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">
                    {shipments.filter(s => s.status === 'CANCELLED').length}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="text-gray-600" size={20} />
                    </div>
                    <span className="text-gray-700">Total Orders</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-600">{shipments.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/booking-details")}
                  className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <Plus className="text-blue-600" size={20} />
                    <span className="text-gray-700 font-medium">New Shipment</span>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </button>

                <button
                  onClick={() => navigate("/track-package")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <Search className="text-gray-600" size={20} />
                    <span className="text-gray-700 font-medium">Track Package</span>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </button>

                <button
                  onClick={fetchUserShipments}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="text-gray-600" size={20} />
                    <span className="text-gray-700 font-medium">Refresh Orders</span>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;