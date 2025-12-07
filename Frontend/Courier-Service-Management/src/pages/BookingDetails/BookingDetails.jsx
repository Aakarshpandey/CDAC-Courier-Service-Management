import React, { useState, createContext, useContext } from 'react';
import { MapPin, Package, CheckCircle, Clock, IndianRupee, ArrowLeft, ChevronRight } from 'lucide-react';

// Context for sharing booking data across pages
const BookingContext = createContext();

const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};

// Validation functions
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

validateEmail;

const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone.replace(/[^\d]/g, ''));
};

const validatePincode = (pincode) => {
  const re = /^\d{6}$/;
  return re.test(pincode);
};

const validateWeight = (weight, vehicleType) => {
  const numWeight = parseFloat(weight);
  if (isNaN(numWeight) || numWeight <= 0) {
    return { valid: false, message: 'Please enter a valid weight' };
  }
  
  const weightLimits = {
    'bike': 5,
    'car': 50,
    'small-truck': 500,
    'large-truck': 2000
  };
  
  if (vehicleType && weightLimits[vehicleType]) {
    const limit = weightLimits[vehicleType];
    if (numWeight > limit) {
      return { valid: false, message: `Weight exceeds ${limit}kg limit for ${vehicleType.replace('-', ' ')}` };
    }
  }
  
  return { valid: true, message: '' };
};

// Navbar Component
const Navbar = ({ onBack, showBackButton = true }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded"></div>
            </div>
            <span className="font-semibold text-xl text-gray-900">courierKaro</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
            Logout
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              RS
            </div>
            <span className="font-medium">Rahul Sharma</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// Progress Steps Component
const ProgressSteps = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center py-8 bg-white border-b">
      <div className="flex items-center">
        {[1, 2, 3].map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep === step
                    ? 'bg-blue-600 text-white'
                    : currentStep > step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step ? '✓' : step}
              </div>
            </div>
            {index < 2 && (
              <div
                className={`w-32 h-1 mx-2 ${
                  currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Step 1: Pickup & Delivery
const PickupDeliveryStep = ({ onNext, onBack }) => {
  const { bookingData, updateBookingData } = useBooking();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, bookingData[field]);
  };

  const validateField = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'pickupAddress':
      case 'deliveryAddress':
        if (!value || value.length < 10) {
          error = 'Address must be at least 10 characters';
        }
        break;
      case 'pickupPhone':
      case 'deliveryPhone':
        if (value && !validatePhone(value)) {
          error = 'Enter valid 10-digit mobile number starting with 6-9';
        }
        break;
      case 'pickupContactName':
      case 'deliveryContactName':
        if (value && value.length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      case 'pickupPincode':
      case 'deliveryPincode':
        if (value && !validatePincode(value)) {
          error = 'Enter valid 6-digit pincode';
        }
        break;
    }
    
    setErrors({ ...errors, [field]: error });
    return !error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateBookingData({ [name]: value });
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleSubmit = () => {
    const requiredFields = ['pickupAddress', 'deliveryAddress', 'pickupPincode', 'deliveryPincode'];
    const newErrors = {};
    let isValid = true;

    requiredFields.forEach(field => {
      if (!bookingData[field]) {
        newErrors[field] = 'This field is required';
        isValid = false;
      } else if (field === 'pickupAddress' || field === 'deliveryAddress') {
        if (bookingData[field].length < 10) {
          newErrors[field] = 'Address must be at least 10 characters';
          isValid = false;
        }
      } else if (field === 'pickupPincode' || field === 'deliveryPincode') {
        if (!validatePincode(bookingData[field])) {
          newErrors[field] = 'Enter valid 6-digit pincode';
          isValid = false;
        }
      }
    });

    if (!isValid) {
      setErrors(newErrors);
      setTouched({
        pickupAddress: true,
        deliveryAddress: true,
        pickupPincode: true,
        deliveryPincode: true
      });
      alert('Please fill in all required fields correctly');
      return;
    }

    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pickup & Delivery</h1>
        <p className="text-gray-600">Where to pickup and deliver</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        {/* Pickup Location */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="text-green-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Pickup Location</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pickupAddress"
                value={bookingData.pickupAddress}
                onChange={handleChange}
                onBlur={() => handleBlur('pickupAddress')}
                placeholder="Enter complete pickup address with area, city, pincode"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.pickupAddress && touched.pickupAddress ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.pickupAddress && touched.pickupAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
              <input
                type="text"
                name="pickupLandmark"
                value={bookingData.pickupLandmark}
                onChange={handleChange}
                placeholder="Near landmark (optional)"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                <input
                  type="text"
                  name="pickupContactName"
                  value={bookingData.pickupContactName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('pickupContactName')}
                  placeholder="Contact person name"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.pickupContactName && touched.pickupContactName ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.pickupContactName && touched.pickupContactName && (
                  <p className="text-red-500 text-sm mt-1">{errors.pickupContactName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="pickupPhone"
                  value={bookingData.pickupPhone}
                  onChange={handleChange}
                  onBlur={() => handleBlur('pickupPhone')}
                  placeholder="+91 phone number"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.pickupPhone && touched.pickupPhone ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.pickupPhone && touched.pickupPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.pickupPhone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pickupPincode"
                value={bookingData.pickupPincode}
                onChange={handleChange}
                onBlur={() => handleBlur('pickupPincode')}
                placeholder="Enter 6-digit pincode"
                maxLength="6"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.pickupPincode && touched.pickupPincode ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.pickupPincode && touched.pickupPincode && (
                <p className="text-red-500 text-sm mt-1">{errors.pickupPincode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Location */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="text-red-600" size={20} />
            <h2 className="text-xl font-semibold text-gray-900">Delivery Location</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="deliveryAddress"
                value={bookingData.deliveryAddress}
                onChange={handleChange}
                onBlur={() => handleBlur('deliveryAddress')}
                placeholder="Enter complete delivery address with area, city, pincode"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.deliveryAddress && touched.deliveryAddress ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.deliveryAddress && touched.deliveryAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.deliveryAddress}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
              <input
                type="text"
                name="deliveryLandmark"
                value={bookingData.deliveryLandmark}
                onChange={handleChange}
                placeholder="Near landmark (optional)"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                <input
                  type="text"
                  name="deliveryContactName"
                  value={bookingData.deliveryContactName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('deliveryContactName')}
                  placeholder="Contact person name"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.deliveryContactName && touched.deliveryContactName ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.deliveryContactName && touched.deliveryContactName && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryContactName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="deliveryPhone"
                  value={bookingData.deliveryPhone}
                  onChange={handleChange}
                  onBlur={() => handleBlur('deliveryPhone')}
                  placeholder="+91 phone number"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.deliveryPhone && touched.deliveryPhone ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.deliveryPhone && touched.deliveryPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryPhone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="deliveryPincode"
                value={bookingData.deliveryPincode}
                onChange={handleChange}
                onBlur={() => handleBlur('deliveryPincode')}
                placeholder="Enter 6-digit pincode"
                maxLength="6"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.deliveryPincode && touched.deliveryPincode ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.deliveryPincode && touched.deliveryPincode && (
                <p className="text-red-500 text-sm mt-1">{errors.deliveryPincode}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Previous
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Step 2: Package & Vehicle (with validation)
const PackageVehicleStep = ({ onNext, onBack }) => {
  const { bookingData, updateBookingData } = useBooking();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const packageTypes = [
    { id: 'documents', name: 'Documents', description: 'Papers, files, letters' },
    { id: 'food', name: 'Food Items', description: 'Meals, snacks, groceries' },
    { id: 'electronics', name: 'Electronics', description: 'Gadgets, devices' },
    { id: 'clothing', name: 'Clothing', description: 'Apparel, accessories' },
    { id: 'gifts', name: 'Gifts', description: 'Birthday, anniversary gifts' },
    { id: 'other', name: 'Other', description: 'Anything else' }
  ];

  const vehicles = [
    { id: 'bike', name: 'Bike', capacity: 'Up to 5kg', time: '30-60 mins', price: '₹50', icon: '🏍️', maxWeight: 5 },
    { id: 'car', name: 'Car', capacity: 'Up to 50kg', time: '45-90 mins', price: '₹150', icon: '🚗', maxWeight: 50 },
    { id: 'small-truck', name: 'Small Truck', capacity: 'Up to 500kg', time: '2-4 hours', price: '₹300', icon: '🚚', maxWeight: 500 },
    { id: 'large-truck', name: 'Large Truck', capacity: 'Up to 2000kg', time: '4-8 hours', price: '₹600', icon: '🚛', maxWeight: 2000 }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateBookingData({ [name]: value });
    
    if (name === 'weight' && touched.weight) {
      const weightValidation = validateWeight(value, bookingData.vehicleType);
      setErrors({ ...errors, weight: weightValidation.message });
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    
    if (field === 'weight') {
      const weightValidation = validateWeight(bookingData.weight, bookingData.vehicleType);
      setErrors({ ...errors, weight: weightValidation.message });
    }
  };

  const handleVehicleSelect = (vehicleId) => {
    updateBookingData({ 
      vehicleType: vehicleId, 
      vehiclePrice: vehicles.find(v => v.id === vehicleId)?.price 
    });
    setErrors({ ...errors, vehicleType: '' });
    
    // Revalidate weight when vehicle changes
    if (bookingData.weight) {
      const weightValidation = validateWeight(bookingData.weight, vehicleId);
      setErrors(prev => ({ ...prev, weight: weightValidation.message }));
    }
  };

  handleVehicleSelect

  const handleSubmit = () => {
    const newErrors = {};

    if (!bookingData.packageType) {
      newErrors.packageType = 'Please select a package type';
    }
    if (!bookingData.vehicleType) {
      newErrors.vehicleType = 'Please select a vehicle type';
    }
    
    // Validate weight if provided
    if (bookingData.weight) {
      const weightValidation = validateWeight(bookingData.weight, bookingData.vehicleType);
      if (!weightValidation.valid) {
        newErrors.weight = weightValidation.message;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ packageType: true, vehicleType: true, weight: true });
      alert('Please fix the errors before proceeding');
      return;
    }

    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Package & Vehicle</h1>
        <p className="text-gray-600">What are you sending and how to deliver</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Package Type <span className="text-red-500">*</span>
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {packageTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  updateBookingData({ packageType: type.id });
                  setErrors({ ...errors, packageType: '' });
                }}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  bookingData.packageType === type.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    bookingData.packageType === type.id ? 'border-blue-600' : 'border-gray-300'
                  }`}>
                    {bookingData.packageType === type.id && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{type.name}</div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {errors.packageType && (
            <p className="text-red-500 text-sm mt-2">{errors.packageType}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="text"
              name="weight"
              value={bookingData.weight}
              onChange={handleChange}
              onBlur={() => handleBlur('weight')}
              placeholder="Package weight"
              className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.weight && touched.weight ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.weight && touched.weight && (
              <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
            )}
            {bookingData.vehicleType && !errors.weight && (
              <p className="text-gray-500 text-xs mt-1">
                Max weight for {bookingData.vehicleType.replace('-', ' ')}: {
                  vehicles.find(v => v.id === bookingData.vehicleType)?.maxWeight
                }kg
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Declared Value (₹)</label>
            <input
              type="text"
              name="declaredValue"
              value={bookingData.declaredValue}
              onChange={handleChange}
              placeholder="Package value"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Package Description</label>
          <textarea
            name="description"
            value={bookingData.description}
            onChange={handleChange}
            placeholder="Brief description of package contents"
            rows={3}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Choose Vehicle Type <span className="text-red-500">*</span>
          </h3>
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => {
                  updateBookingData({ 
                    vehicleType: vehicle.id, 
                    vehiclePrice: vehicle.price 
                  });
                  setErrors({ ...errors, vehicleType: '' });
                  
                  // Revalidate weight when vehicle changes
                  if (bookingData.weight) {
                    const weightValidation = validateWeight(bookingData.weight, vehicle.id);
                    setErrors(prev => ({ ...prev, weight: weightValidation.message }));
                  }
                }}
                className={`w-full p-4 border-2 rounded-lg text-left transition ${
                  bookingData.vehicleType === vehicle.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                    bookingData.vehicleType === vehicle.id ? 'border-blue-600' : 'border-gray-300'
                  }`}>
                    {bookingData.vehicleType === vehicle.id && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                    {vehicle.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                    <p className="text-sm text-gray-600">Capacity: {vehicle.capacity}</p>
                    <p className="text-sm text-gray-600">Est. Time: {vehicle.time}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-lg">{vehicle.price}</div>
                    <div className="text-xs text-gray-500">base price</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {errors.vehicleType && (
            <p className="text-red-500 text-sm mt-2">{errors.vehicleType}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Previous
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// Step 3: Confirmation & Payment
const ConfirmationStep = ({ onBack }) => {
  const { bookingData, updateBookingData } = useBooking();
  const [couponCode, setCouponCode] = useState('');

  const handleConfirm = () => {
    console.log('Final Booking Data:', bookingData);
    alert('🎉 Booking Confirmed Successfully!\n\nTracking ID: CK' + Math.random().toString(36).substr(2, 9).toUpperCase());
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirmation & Payment</h1>
        <p className="text-gray-600">Review and confirm payment</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Book!</h2>
        <p className="text-gray-600">Please review your booking details and choose payment method</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Booking Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
              <span className="text-gray-600">From: {bookingData.pickupAddress || 'Not specified'}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
              <span className="text-gray-600">To: {bookingData.deliveryAddress || 'Not specified'}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t">
              <div>
                <span className="text-gray-600">Package:</span>
                <span className="ml-2 font-medium text-gray-900 capitalize">{bookingData.packageType || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Vehicle:</span>
                <span className="ml-2 font-medium text-gray-900 capitalize">{bookingData.vehicleType?.replace('-', ' ') || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-blue-600" size={20} />
            <h3 className="font-semibold text-lg text-gray-900">Schedule Pickup</h3>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => updateBookingData({ scheduleOption: 'asap' })}
              className={`w-full p-4 border-2 rounded-lg text-left transition ${
                bookingData.scheduleOption === 'asap' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  bookingData.scheduleOption === 'asap' ? 'border-blue-600' : 'border-gray-300'
                }`}>
                  {bookingData.scheduleOption === 'asap' && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">As Soon As Possible</div>
                  <p className="text-sm text-gray-600">Pickup within 30-60 minutes</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-lg text-gray-900 mb-4">Payment Method</h3>
          <div className="space-y-3">
            <button
              onClick={() => updateBookingData({ paymentMethod: 'online' })}
              className={`w-full p-4 border-2 rounded-lg text-left transition ${
                bookingData.paymentMethod === 'online' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  bookingData.paymentMethod === 'online' ? 'border-blue-600' : 'border-gray-300'
                }`}>
                  {bookingData.paymentMethod === 'online' && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">Pay Online</div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">Recommended</span>
                  </div>
                  <p className="text-sm text-gray-600">UPI, Cards, Net Banking</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => updateBookingData({ paymentMethod: 'cod' })}
              className={`w-full p-4 border-2 rounded-lg text-left transition ${
                bookingData.paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                  bookingData.paymentMethod === 'cod' ? 'border-blue-600' : 'border-gray-300'
                }`}>
                  {bookingData.paymentMethod === 'cod' && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Cash on Delivery</div>
                  <p className="text-sm text-gray-600">Pay to delivery partner</p>
                </div>
              </div>
            </button>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code (Optional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50">
                Apply
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
        >
          Confirm Booking
        </button>

        <button
          onClick={onBack}
          className="w-full px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} />
          Previous
        </button>
      </div>
    </div>
  );
};

// Main App with Router
const BookingFlowApp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    // Step 1
    pickupAddress: '',
    pickupLandmark: '',
    pickupContactName: '',
    pickupPhone: '',
    pickupPincode: '',
    deliveryAddress: '',
    deliveryLandmark: '',
    deliveryContactName: '',
    deliveryPhone: '',
    deliveryPincode: '',
    // Step 2
    packageType: '',
    weight: '',
    declaredValue: '',
    description: '',
    vehicleType: '',
    vehiclePrice: '',
    // Step 3
    scheduleOption: 'asap',
    paymentMethod: 'online'
  });

  const updateBookingData = (data) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBookingData }}>
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          onBack={goToPreviousStep} 
          showBackButton={currentStep > 1}
        />
        <ProgressSteps currentStep={currentStep} />
        
        {currentStep === 1 && (
          <PickupDeliveryStep 
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        )}
        
        {currentStep === 2 && (
          <PackageVehicleStep 
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        )}
        
        {currentStep === 3 && (
          <ConfirmationStep 
            onBack={goToPreviousStep}
          />
        )}
      </div>
    </BookingContext.Provider>
  );
};

export default BookingFlowApp;