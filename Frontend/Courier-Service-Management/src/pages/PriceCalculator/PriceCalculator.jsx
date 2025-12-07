import React, { useState } from 'react';
import { Calculator, MapPin, Package, Truck, Car, Bike, Clock, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../../components/NavBar/Navbar';
export default function PriceCalculator() {
  const [formData, setFormData] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    weight: '',
    packageType: '',
    vehicleType: '',
    deliverySpeed: 'standard'
  });

  const [calculatedPrice, setCalculatedPrice] = useState(null);

  const vehicleTypes = [
    {
      id: 'bike',
      name: 'Bike/Scooter',
      icon: Bike,
      iconSize: 'w-8 h-8',
      description: 'For small packages up to 10kg',
      maxWeight: '10kg',
      basePrice: 30,
      pricePerKm: 5
    },
    {
      id: 'car',
      name: 'Car/Sedan',
      icon: Car,
      iconSize: 'w-8 h-8',
      description: 'For medium packages up to 50kg',
      maxWeight: '50kg',
      basePrice: 50,
      pricePerKm: 8
    },
    {
      id: 'small-truck',
      name: 'Small Truck',
      icon: Truck,
      iconSize: 'w-7 h-7',
      description: 'For large packages up to 500kg',
      maxWeight: '500kg',
      basePrice: 100,
      pricePerKm: 12
    },
    {
      id: 'large-truck',
      name: 'Large Truck',
      icon: Truck,
      iconSize: 'w-9 h-9',
      description: 'For bulk deliveries up to 2000kg',
      maxWeight: '2000kg',
      basePrice: 200,
      pricePerKm: 18
    }
  ];

  const deliveryOptions = [
    { id: 'express', label: 'Express (2-4 hours)', multiplier: 2, discount: 0 },
    { id: 'standard', label: 'Standard (Same day)', multiplier: 1, discount: 0 },
    { id: 'economy', label: 'Economy (Next day)', multiplier: 1, discount: 20 }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVehicleSelect = (vehicleId) => {
    setFormData(prev => ({
      ...prev,
      vehicleType: vehicleId
    }));
  };

  const handleDeliverySpeedSelect = (speedId) => {
    setFormData(prev => ({
      ...prev,
      deliverySpeed: speedId
    }));
  };

  const calculatePrice = () => {
    const vehicle = vehicleTypes.find(v => v.id === formData.vehicleType);
    const speed = deliveryOptions.find(s => s.id === formData.deliverySpeed);
    
    if (!vehicle || !speed) {
      alert('Please select a vehicle type');
      return;
    }

    const estimatedDistance = 15;
    const basePrice = vehicle.basePrice + (vehicle.pricePerKm * estimatedDistance);
    const priceWithSpeed = basePrice * speed.multiplier;
    const finalPrice = priceWithSpeed - (priceWithSpeed * speed.discount / 100);

    setCalculatedPrice({
      subtotal: basePrice,
      speedCharge: priceWithSpeed - basePrice,
      discount: priceWithSpeed * speed.discount / 100,
      total: finalPrice,
      distance: estimatedDistance
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      {/* Main Content */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calculator className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Price Calculator</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get instant price estimates for your delivery. Choose your vehicle type and get 
              accurate pricing based on distance and package details.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
                {/* Delivery Details */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Delivery Details</h2>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">Fill in your pickup and delivery information to get an accurate quote</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label>
                      <input
                        type="text"
                        name="pickupAddress"
                        value={formData.pickupAddress}
                        onChange={handleInputChange}
                        placeholder="Enter pickup location"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                      <input
                        type="text"
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleInputChange}
                        placeholder="Enter delivery location"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Package Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="Enter weight in kg"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Package Type</label>
                      <select
                        name="packageType"
                        value={formData.packageType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      >
                        <option value="">Select package type</option>
                        <option value="documents">Documents</option>
                        <option value="electronics">Electronics</option>
                        <option value="fragile">Fragile Items</option>
                        <option value="general">General Package</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Vehicle Type Selection */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Vehicle Type</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vehicleTypes.map((vehicle) => {
                      const Icon = vehicle.icon;
                      return (
                        <button
                          key={vehicle.id}
                          onClick={() => handleVehicleSelect(vehicle.id)}
                          className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                            formData.vehicleType === vehicle.id
                              ? 'border-blue-600 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <Icon className={`${vehicle.iconSize} ${formData.vehicleType === vehicle.id ? 'text-blue-600' : 'text-gray-400'}`} />
                            {formData.vehicleType === vehicle.id && (
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{vehicle.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{vehicle.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Max: {vehicle.maxWeight}</span>
                            <span className="font-semibold text-blue-600">₹{vehicle.basePrice} + ₹{vehicle.pricePerKm}/km</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery Speed */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Speed</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {deliveryOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleDeliverySpeedSelect(option.id)}
                        className={`p-5 rounded-xl border-2 transition-all ${
                          formData.deliverySpeed === option.id
                            ? 'border-blue-600 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-3">
                          {option.id === 'express' && <AlertCircle className="w-6 h-6 text-red-500" />}
                          {option.id === 'standard' && <CheckCircle className="w-6 h-6 text-green-500" />}
                          {option.id === 'economy' && <Clock className="w-6 h-6 text-blue-500" />}
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900 text-sm mb-1">{option.label}</p>
                          <p className="text-xs text-gray-600">
                            {option.id === 'express' && '+100%'}
                            {option.id === 'standard' && 'Standard'}
                            {option.id === 'economy' && '-20%'}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={calculatePrice}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition font-semibold text-lg flex items-center justify-center gap-2 shadow-lg"
                >
                  <Calculator className="w-5 h-5" />
                  Calculate Price
                </button>

                {/* Price Result */}
                {calculatedPrice && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-gray-700">
                        <span>Base Price ({calculatedPrice.distance}km)</span>
                        <span>₹{calculatedPrice.subtotal.toFixed(2)}</span>
                      </div>
                      {calculatedPrice.speedCharge > 0 && (
                        <div className="flex justify-between text-gray-700">
                          <span>Speed Charge</span>
                          <span>₹{calculatedPrice.speedCharge.toFixed(2)}</span>
                        </div>
                      )}
                      {calculatedPrice.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-₹{calculatedPrice.discount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t border-blue-300 flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total Price</span>
                      <span className="text-2xl font-bold text-blue-600">₹{calculatedPrice.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Why Choose Us */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Why Choose Us?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Real-time Tracking</h4>
                      <p className="text-sm text-gray-600">Track your package live from pickup to delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">100% Insured</h4>
                      <p className="text-sm text-gray-600">Complete insurance coverage for your packages</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Safe Handling</h4>
                      <p className="text-sm text-gray-600">Professional handling of all package types</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <img 
                  src="/images/deliveryTruck.jpg" 
                  alt="Delivery trucks"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-center text-sm text-gray-600">If it's urgent, courierKaro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}