import React, { useState, useRef } from 'react';
import { Calculator, MapPin, Package, Truck, Car, Bike, Clock, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/NavBar/Navbar';
import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api'; 

const center = {
  lat: 18.52043,
  lng: 73.85674
};

const libraries = ['places'];

export default function PriceCalculator() {

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const originRef = useRef();
  const destinationRef = useRef();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBaKwXTqp_FqjrXUcUMrCJCvfS2xIR4MVk',
    libraries: libraries,
    region: "IN"
  });

  

  const [formData, setFormData] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    weight: '',
    packageType: '',
    vehicleType: ''
  });

  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [weightError, setWeightError] = useState('');

  const vehicleTypes = [
    {
      id: 'bike',
      name: 'Bike/Scooter',
      icon: Bike,
      iconSize: 'w-8 h-8',
      description: 'For small packages up to 5kg',
      maxWeight: 5,
      maxWeightLabel: '5kg',
      basePrice: 50,
      pricePerKm: 10
    },
    {
      id: 'car',
      name: 'Car/Sedan',
      icon: Car,
      iconSize: 'w-8 h-8',
      description: 'For medium packages up to 50kg',
      maxWeight: 50,
      maxWeightLabel: '50kg',
      basePrice: 150,
      pricePerKm: 15
    },
    {
      id: 'small-truck',
      name: 'Small Truck',
      icon: Truck,
      iconSize: 'w-7 h-7',
      description: 'For large packages up to 500kg',
      maxWeight: 500,
      maxWeightLabel: '500kg',
      basePrice: 300,
      pricePerKm: 20
    },
    {
      id: 'large-truck',
      name: 'Large Truck',
      icon: Truck,
      iconSize: 'w-9 h-9',
      description: 'For bulk deliveries up to 2000kg',
      maxWeight: 2000,
      maxWeightLabel: '2000kg',
      basePrice: 600,
      pricePerKm: 25
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear weight error when user types
    if (name === 'weight') {
      setWeightError('');
    }
  };

  const handleVehicleSelect = (vehicleId) => {
    setFormData(prev => ({
      ...prev,
      vehicleType: vehicleId
    }));
    
    // Validate weight when vehicle is selected
    if (formData.weight) {
      validateWeight(formData.weight, vehicleId);
    }
  };
  
  const validateWeight = (weight, vehicleId) => {
    const weightNum = parseFloat(weight);
    const vehicle = vehicleTypes.find(v => v.id === vehicleId);
    
    if (!vehicle) return true;
    
    if (isNaN(weightNum) || weightNum <= 0) {
      setWeightError('Please enter a valid weight');
      return false;
    }
    
    if (weightNum > vehicle.maxWeight) {
      setWeightError(`Weight exceeds ${vehicle.maxWeightLabel} limit for ${vehicle.name}`);
      return false;
    }
    
    setWeightError('');
    return true;
  };

  const calculatePrice = async() => {
    setDirectionsResponse(null);
    const vehicle = vehicleTypes.find(v => v.id === formData.vehicleType);
    setDirectionsResponse(null);
    if (!vehicle) {
      toast.error('Please select a vehicle type');
      return;
    }
    
    // Validate weight
    if (!formData.weight) {
      toast.error('Please enter package weight');
      return;
    }
    
    if (!validateWeight(formData.weight, formData.vehicleType)) {
      return;
    }

    if(originRef.current.value === '' || destinationRef.current.value === '') {
      toast.error('Please enter both pickup and delivery addresses');
      return;
    }

    const directionService = new google.maps.DirectionsService();
    const results = await directionService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING 
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
    const estimatedDistance = results.routes[0].legs[0].distance.value/1000;
    const basePrice = vehicle.basePrice + (vehicle.pricePerKm * estimatedDistance);
    const finalPrice = basePrice;

    setCalculatedPrice({
      basePrice: vehicle.basePrice,
      distanceCharge: vehicle.pricePerKm * estimatedDistance,
      total: finalPrice,
      distance: estimatedDistance,
      vehicleName: vehicle.name
    });
    window.scrollTo(0, 300);
  };

  // Show page even if Google Maps fails to load
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar/>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
            <p className="text-sm text-gray-500 mt-2">If this takes too long, check your API key</p>
          </div>
        </div>
      </div>
    );
  }

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
                      <Autocomplete restrictions={{ country: "in"}}>

                      <input
                        type="text"
                        name="pickupAddress"
                        value={originRef.current?.value || ''}
                        ref={originRef}
                        onChange={handleInputChange}
                        placeholder="Enter pickup location"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                      </Autocomplete>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                      <Autocomplete restrictions={{ country: "in"}}>
                        <input
                          type="text"
                          name="deliveryAddress"
                          value={destinationRef.current?.value || ''}
                          ref={destinationRef}
                          onChange={handleInputChange}
                          placeholder="Enter delivery location"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </Autocomplete>
                    </div>
                  </div>
                  <GoogleMap center={center} zoom={15} mapContainerStyle={{ width: '100%', height: '400px' }} onLoad={map => setMap(map)}>
                   <Marker position={center} />
                    {directionsResponse && <DirectionsRenderer directions={directionsResponse} options={{suppressMarkers: false, preserveViewport: false}}/>} 
                  </GoogleMap>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Package Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="Enter weight in kg"
                        className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                          weightError ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {weightError && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {weightError}
                        </p>
                      )}
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
                            <span className="text-gray-500">Max: {vehicle.maxWeightLabel}</span>
                            <span className="font-semibold text-blue-600">₹{vehicle.basePrice} + ₹{vehicle.pricePerKm}/km</span>
                          </div>
                        </button>
                      );
                    })}
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
              {calculatedPrice && (
                  <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-gray-700">
                        <span>Vehicle: {calculatedPrice.vehicleName}</span>
                        <span>₹{calculatedPrice.basePrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Distance ({calculatedPrice.distance}km)</span>
                        <span>₹{calculatedPrice.distanceCharge.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-blue-300 flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total Price</span>
                      <span className="text-2xl font-bold text-blue-600">₹{calculatedPrice.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
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