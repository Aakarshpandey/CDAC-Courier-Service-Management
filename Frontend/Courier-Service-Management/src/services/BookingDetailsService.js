import api from './api';

// Constants
export const packageTypes = [
  { id: 'documents', name: 'Documents' },
  { id: 'food', name: 'Food Items' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'gifts', name: 'Gifts' },
  { id: 'other', name: 'Other' }
];

export const vehicles = [
  { id: 'bike', name: 'Bike', capacity: 'Up to 5kg', basePrice: 50, pricePerKm: 5, icon: '🏍️', maxWeight: 5 },
  { id: 'car', name: 'Car', capacity: 'Up to 50kg', basePrice: 150, pricePerKm: 10, icon: '🚗', maxWeight: 50 },
  { id: 'small truck', name: 'Small Truck', capacity: 'Up to 500kg', basePrice: 300, pricePerKm: 15, icon: '🚚', maxWeight: 500 },
  { id: 'large truck', name: 'Large Truck', capacity: 'Up to 2000kg', basePrice: 600, pricePerKm: 20, icon: '🚛', maxWeight: 2000 }
];

// Validation helpers
const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone.replace(/[^\d]/g, ''));
};

const validatePincode = (pincode) => {
  const re = /^\d{6}$/;
  return re.test(pincode);
};

// Validate form data
export const validateForm = (formData, pickupAddress, deliveryAddress) => {
  const errors = {};

  if (!pickupAddress || pickupAddress.length < 10) {
    errors.pickupAddress = 'Address must be at least 10 characters';
  }
  if (!formData.pickupPincode || !validatePincode(formData.pickupPincode)) {
    errors.pickupPincode = 'Enter valid 6-digit pincode';
  }
  if (formData.pickupPhone && !validatePhone(formData.pickupPhone)) {
    errors.pickupPhone = 'Enter valid 10-digit phone number';
  }

  if (!deliveryAddress || deliveryAddress.length < 10) {
    errors.deliveryAddress = 'Address must be at least 10 characters';
  }
  if (!formData.deliveryPincode || !validatePincode(formData.deliveryPincode)) {
    errors.deliveryPincode = 'Enter valid 6-digit pincode';
  }
  if (formData.deliveryPhone && !validatePhone(formData.deliveryPhone)) {
    errors.deliveryPhone = 'Enter valid 10-digit phone number';
  }

  if (!formData.packageType) {
    errors.packageType = 'Please select a package type';
  }
  if (!formData.vehicleType) {
    errors.vehicleType = 'Please select a vehicle type';
  }

  if (formData.weight && formData.vehicleType) {
    const vehicle = vehicles.find(v => v.id === formData.vehicleType);
    if (vehicle && parseFloat(formData.weight) > vehicle.maxWeight) {
      errors.weight = `Weight exceeds ${vehicle.maxWeight}kg limit for ${vehicle.name}`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Calculate price based on vehicle and distance
export const calculatePriceFromDistance = (vehicleType, distanceKm) => {
  const vehicle = vehicles.find(v => v.id === vehicleType);
  if (!vehicle) return null;

  const totalPrice = vehicle.basePrice + (vehicle.pricePerKm * distanceKm);
  return {
    basePrice: vehicle.basePrice,
    distanceCharge: vehicle.pricePerKm * distanceKm,
    total: totalPrice,
    distance: distanceKm,
    vehicleName: vehicle.name,
    pricePerKm: vehicle.pricePerKm
  };
};

// Build shipment request object
export const buildShipmentRequest = (formData, pickupAddress, deliveryAddress, distance, calculatedPrice) => {
  return {
    // TODO: Replace hardcoded email with actual user email from authentication/context
    userEmail: localStorage.getItem('userEmail'), // HARDCODED FOR DEVELOPMENT
    pickupLocation: {
      fullAddress: pickupAddress,
      contactName: formData.pickupContactName,
      phoneNo: formData.pickupPhone,
      pincode: formData.pickupPincode
    },
    deliveryLocation: {
      fullAddress: deliveryAddress,
      contactName: formData.deliveryContactName,
      phoneNo: formData.deliveryPhone,
      pincode: formData.deliveryPincode
    },
    packageType: formData.packageType,
    weight: parseFloat(formData.weight) || 0,
    vehicleType: formData.vehicleType,
    distanceKm: distance,
    calculatedPrice: calculatedPrice?.total || 0
  };
};

// Create shipment API call
export const createShipment = async (shipmentRequest) => {
  const response = await api.post("/api/shipments/send", shipmentRequest);
  return response.data;
};

// Get vehicle by id
export const getVehicleById = (vehicleId) => {
  return vehicles.find(v => v.id === vehicleId);
};

export default {
  packageTypes,
  vehicles,
  validateForm,
  calculatePriceFromDistance,
  buildShipmentRequest,
  createShipment,
  getVehicleById
};
