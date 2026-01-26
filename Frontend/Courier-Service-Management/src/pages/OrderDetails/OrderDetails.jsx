import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, User, Phone, Clock, Truck, CreditCard, Loader, CheckCircle, Circle } from 'lucide-react';
import axios from 'axios';
import Navbar from '../../components/NavBar/Navbar';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = { name: "Rohan Sharma" };

  const [shipment, setShipment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShipmentDetails();
  }, [id]);

  const fetchShipmentDetails = async () => {
    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await axios.get(`${API_URL}/api/shipments/${id}`);
      setShipment(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching shipment:', err);
      setError('Failed to load shipment details');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'IN_TRANSIT':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'DELIVERED':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
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

  // Tracking steps based on status
  const getTrackingSteps = (status) => {
    const steps = [
      { id: 'PENDING', label: 'Order Placed', description: 'Your order has been placed' },
      { id: 'ASSIGNED', label: 'Driver Assigned', description: 'A driver has been assigned to your order' },
      { id: 'IN_TRANSIT', label: 'In Transit', description: 'Your package is on the way' },
      { id: 'DELIVERED', label: 'Delivered', description: 'Package delivered successfully' }
    ];

    const statusOrder = ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(status?.toUpperCase());

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="flex items-center justify-center py-32">
          <Loader className="animate-spin text-blue-600" size={48} />
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-16">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Order Not Found</h2>
            <p className="text-gray-500 mb-6">{error || 'The order you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/user-dashboard')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const trackingSteps = getTrackingSteps(shipment.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/user-dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{shipment.shipmentId}</h1>
              <p className="text-gray-500 mt-1">Placed on {formatDate(shipment.createdAt)}</p>
            </div>
            <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${getStatusColor(shipment.status)}`}>
              {shipment.status?.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Live Tracking Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Truck className="text-blue-600" size={24} />
            Live Tracking
          </h2>

          {/* Tracking Timeline */}
          <div className="relative">
            {trackingSteps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4 mb-8 last:mb-0">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center">
                  {step.completed ? (
                    <CheckCircle className={`${step.current ? 'text-blue-600' : 'text-green-500'}`} size={24} />
                  ) : (
                    <Circle className="text-gray-300" size={24} />
                  )}
                  {index < trackingSteps.length - 1 && (
                    <div className={`w-0.5 h-12 mt-2 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>

                {/* Step content */}
                <div className={`flex-1 ${!step.completed && 'opacity-50'}`}>
                  <p className={`font-semibold ${step.current ? 'text-blue-600' : step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.label}
                  </p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                  {step.current && (
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded">
                      Current Status
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {shipment.status === 'CANCELLED' && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700 font-medium">This order has been cancelled.</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pickup Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Pickup Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-900">{shipment.pickupAddress || 'N/A'}</p>
                  {shipment.pickupPincode && (
                    <p className="text-gray-600 text-sm">Pincode: {shipment.pickupPincode}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Contact Name</p>
                  <p className="text-gray-900">{shipment.pickupContactName || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{shipment.pickupPhone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              Delivery Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-900">{shipment.deliveryAddress || 'N/A'}</p>
                  {shipment.deliveryPincode && (
                    <p className="text-gray-600 text-sm">Pincode: {shipment.deliveryPincode}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Contact Name</p>
                  <p className="text-gray-900">{shipment.deliveryContactName || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{shipment.deliveryPhone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Package & Pricing Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="text-blue-600" size={24} />
            Package & Pricing Details
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Package Type</p>
              <p className="text-gray-900 font-medium">{shipment.packageType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Weight</p>
              <p className="text-gray-900 font-medium">{shipment.weight ? `${shipment.weight} kg` : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Vehicle Type</p>
              <p className="text-gray-900 font-medium capitalize">{shipment.vehicleType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Distance</p>
              <p className="text-gray-900 font-medium">{shipment.distanceKm ? `${shipment.distanceKm} km` : 'N/A'}</p>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Pricing Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Base Fare</span>
                <span>{shipment.baseFare ? `₹${shipment.baseFare}` : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Per KM Rate</span>
                <span>{shipment.perKmRate ? `₹${shipment.perKmRate}/km` : 'N/A'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Distance Charge ({shipment.distanceKm || 0} km × ₹{shipment.perKmRate || 0})</span>
                <span>₹{((shipment.distanceKm || 0) * (shipment.perKmRate || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                <span>Total Amount</span>
                <span className="text-blue-600">₹{shipment.calculatedPrice || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/user-dashboard')}
            className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Back to Orders
          </button>
          {shipment.status === 'PENDING' && (
            <button
              className="flex-1 py-3 px-6 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition border border-red-200"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
