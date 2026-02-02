import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Package, ArrowLeft, Truck, Calculator, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/NavBar/Navbar';
import { useJsApiLoader, GoogleMap, Autocomplete, DirectionsRenderer, Marker } from '@react-google-maps/api';
import {
  packageTypes,
  vehicles,
  validateForm as validateFormService,
  calculatePriceFromDistance,
  buildShipmentRequest,
  createShipment
} from '../../services/BookingDetailsService';



const libraries = ['places'];

const mapCenter = {
  lat: 18.52043,
  lng: 73.85674
};

const BookingDetails = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  const pickupAutocompleteRef = useRef(null);
  const deliveryAutocompleteRef = useRef(null);
  const pickupInputRef = useRef(null);
  const deliveryInputRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBaKwXTqp_FqjrXUcUMrCJCvfS2xIR4MVk',
    libraries: libraries,
    region: "IN"
  });

  const [formData, setFormData] = useState({
    pickupAddress: '',
    pickupContactName: '',
    pickupPhone: '',
    pickupPincode: '',
    deliveryAddress: '',
    deliveryContactName: '',
    deliveryPhone: '',
    deliveryPincode: '',
    packageType: '',
    weight: '',
    vehicleType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Reset calculated price when vehicle changes
    if (name === 'vehicleType') {
      setCalculatedPrice(null);
      setDirectionsResponse(null);
    }
  };

  const handlePickupPlaceSelect = () => {
    if (pickupAutocompleteRef.current) {
      const place = pickupAutocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        setFormData(prev => ({ ...prev, pickupAddress: place.formatted_address }));
        setCalculatedPrice(null);
        setDirectionsResponse(null);
      }
    }
  };

  const handleDeliveryPlaceSelect = () => {
    if (deliveryAutocompleteRef.current) {
      const place = deliveryAutocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        setFormData(prev => ({ ...prev, deliveryAddress: place.formatted_address }));
        setCalculatedPrice(null);
        setDirectionsResponse(null);
      }
    }
  };

  const calculatePrice = async () => {
    if (!formData.vehicleType) {
      setErrors(prev => ({ ...prev, vehicleType: 'Please select a vehicle type' }));
      return;
    }

    const pickupAddress = pickupInputRef.current?.value || formData.pickupAddress;
    const deliveryAddress = deliveryInputRef.current?.value || formData.deliveryAddress;

    if (!pickupAddress || !deliveryAddress) {
      toast.error('Please enter both pickup and delivery addresses');
      return;
    }

    try {
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: pickupAddress,
        destination: deliveryAddress,
        travelMode: google.maps.TravelMode.DRIVING
      });

      setDirectionsResponse(results);
      const distanceValue = results.routes[0].legs[0].distance.value / 1000; // in km
      const durationText = results.routes[0].legs[0].duration.text;

      setDistance(distanceValue);
      setDuration(durationText);

      const priceDetails = calculatePriceFromDistance(formData.vehicleType, distanceValue);
      if (priceDetails) {
        setCalculatedPrice(priceDetails);
      }

      // Update form data with selected addresses
      setFormData(prev => ({
        ...prev,
        pickupAddress: pickupAddress,
        deliveryAddress: deliveryAddress
      }));

    } catch (error) {
      console.error('Error calculating route:', error);
      toast.error('Could not calculate route. Please check the addresses.');
    }
  };

  const validateForm = () => {
    const pickupAddress = pickupInputRef.current?.value || formData.pickupAddress;
    const deliveryAddress = deliveryInputRef.current?.value || formData.deliveryAddress;

    const { isValid, errors: validationErrors } = validateFormService(formData, pickupAddress, deliveryAddress);
    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Require price calculation before submitting
    if (!calculatedPrice) {
      toast.error('Please calculate the price before booking');
      return;
    }

    setIsLoading(true);

    try {
      const pickupAddress = pickupInputRef.current?.value || formData.pickupAddress;
      const deliveryAddress = deliveryInputRef.current?.value || formData.deliveryAddress;

      const shipmentRequest = buildShipmentRequest(formData, pickupAddress, deliveryAddress, distance, calculatedPrice);

     

      const response = await createShipment(shipmentRequest);

      console.log('Shipment response:', response);

      if (response.status === 'SUCCESS') {
        toast.success(`Booking Confirmed! Shipment ID: ${response.shipmentId}`);
        navigate('/user-dashboard');
      } else {
        toast.error(`Error: ${response.message}`);
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error(`Failed to create shipment: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading Maps...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/user-dashboard')}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Send New Package</h1>
            <p className="text-gray-600">Fill in the details to book your shipment</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pickup & Delivery Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pickup Location */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="text-green-600" size={20} />
                    <h2 className="text-lg font-semibold text-gray-900">Pickup Location</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Address <span className="text-red-500">*</span>
                      </label>
                      <Autocomplete
                        onLoad={(autocomplete) => { pickupAutocompleteRef.current = autocomplete; }}
                        onPlaceChanged={handlePickupPlaceSelect}
                        restrictions={{ country: "in" }}
                      >
                        <input
                          ref={pickupInputRef}
                          type="text"
                          name="pickupAddress"
                          defaultValue={formData.pickupAddress}
                          placeholder="Enter complete pickup address"
                          className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.pickupAddress ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                      </Autocomplete>
                      {errors.pickupAddress && <p className="text-red-500 text-xs mt-1">{errors.pickupAddress}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                        <input
                          type="text"
                          name="pickupContactName"
                          value={formData.pickupContactName}
                          onChange={handleChange}
                          placeholder="Contact person"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="pickupPhone"
                          value={formData.pickupPhone}
                          onChange={handleChange}
                          placeholder="10-digit number"
                          className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.pickupPhone ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                        {errors.pickupPhone && <p className="text-red-500 text-xs mt-1">{errors.pickupPhone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pickupPincode"
                        value={formData.pickupPincode}
                        onChange={handleChange}
                        placeholder="6-digit pincode"
                        maxLength="6"
                        className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.pickupPincode ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {errors.pickupPincode && <p className="text-red-500 text-xs mt-1">{errors.pickupPincode}</p>}
                    </div>
                  </div>
                </div>

                {/* Delivery Location */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="text-red-600" size={20} />
                    <h2 className="text-lg font-semibold text-gray-900">Delivery Location</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Address <span className="text-red-500">*</span>
                      </label>
                      <Autocomplete
                        onLoad={(autocomplete) => { deliveryAutocompleteRef.current = autocomplete; }}
                        onPlaceChanged={handleDeliveryPlaceSelect}
                        restrictions={{ country: "in" }}
                      >
                        <input
                          ref={deliveryInputRef}
                          type="text"
                          name="deliveryAddress"
                          defaultValue={formData.deliveryAddress}
                          placeholder="Enter complete delivery address"
                          className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.deliveryAddress ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                      </Autocomplete>
                      {errors.deliveryAddress && <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                        <input
                          type="text"
                          name="deliveryContactName"
                          value={formData.deliveryContactName}
                          onChange={handleChange}
                          placeholder="Contact person"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="deliveryPhone"
                          value={formData.deliveryPhone}
                          onChange={handleChange}
                          placeholder="10-digit number"
                          className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors.deliveryPhone ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                        {errors.deliveryPhone && <p className="text-red-500 text-xs mt-1">{errors.deliveryPhone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="deliveryPincode"
                        value={formData.deliveryPincode}
                        onChange={handleChange}
                        placeholder="6-digit pincode"
                        maxLength="6"
                        className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.deliveryPincode ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                      {errors.deliveryPincode && <p className="text-red-500 text-xs mt-1">{errors.deliveryPincode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Route Preview</h2>
                <GoogleMap
                  center={mapCenter}
                  zoom={12}
                  mapContainerStyle={{ width: '100%', height: '300px', borderRadius: '8px' }}
                >
                  {directionsResponse && (
                    <DirectionsRenderer
                      directions={directionsResponse}
                      options={{ suppressMarkers: false, preserveViewport: false }}
                    />
                  )}
                  {!directionsResponse && <Marker position={mapCenter} />}
                </GoogleMap>
                {distance && duration && (
                  <div className="flex gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Distance:</span>
                      <span className="font-semibold text-gray-900">{distance.toFixed(2)} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Est. Duration:</span>
                      <span className="font-semibold text-gray-900">{duration}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Package Details Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="text-blue-600" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">Package Details</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Package Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="packageType"
                      value={formData.packageType}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.packageType ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select package type</option>
                      {packageTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                    {errors.packageType && <p className="text-red-500 text-xs mt-1">{errors.packageType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Package weight"
                      min="0"
                      step="0.1"
                      className={`w-full px-3 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.weight ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
                  </div>
                </div>
              </div>

              {/* Vehicle Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="text-purple-600" size={20} />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Select Vehicle <span className="text-red-500">*</span>
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, vehicleType: vehicle.id }));
                        setErrors(prev => ({ ...prev, vehicleType: '' }));
                        setCalculatedPrice(null);
                      }}
                      className={`p-4 border-2 rounded-lg text-center transition ${
                        formData.vehicleType === vehicle.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{vehicle.icon}</div>
                      <div className="font-semibold text-gray-900">{vehicle.name}</div>
                      <div className="text-xs text-gray-500">{vehicle.capacity}</div>
                      <div className="text-sm font-bold text-blue-600 mt-1">
                        ₹{vehicle.basePrice} + ₹{vehicle.pricePerKm}/km
                      </div>
                    </button>
                  ))}
                </div>
                {errors.vehicleType && <p className="text-red-500 text-xs mt-2">{errors.vehicleType}</p>}
              </div>

              {/* Calculate Price Button */}
              <button
                type="button"
                onClick={calculatePrice}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Calculator size={20} />
                Calculate Price
              </button>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/user-dashboard')}
                  className="flex-1 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !calculatedPrice}
                  className={`flex-1 py-3 rounded-lg font-semibold transition ${
                    isLoading || !calculatedPrice
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'Creating Shipment...' : 'Book Shipment'}
                </button>
              </div>
            </form>
          </div>

          {/* Price Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="text-blue-600" size={20} />
                Price Summary
              </h3>

              {calculatedPrice ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Vehicle ({calculatedPrice.vehicleName})</span>
                      <span>₹{calculatedPrice.basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Distance ({calculatedPrice.distance.toFixed(2)} km × ₹{calculatedPrice.pricePerKm})</span>
                      <span>₹{calculatedPrice.distanceCharge.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-blue-600">₹{calculatedPrice.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {duration && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Estimated Delivery Time:</span> {duration}
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    * Final price may vary based on actual distance and conditions
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-500 text-sm">
                    Enter pickup & delivery addresses, select a vehicle, then click "Calculate Price"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
