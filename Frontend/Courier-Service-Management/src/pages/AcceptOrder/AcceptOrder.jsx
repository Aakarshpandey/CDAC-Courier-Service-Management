import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { acceptOrder } from "../../services/users";
import toast from "react-hot-toast";
import Navbar from "../../components/NavBar/Navbar";

const libraries = ['places'];

const mapCenter = {
  lat: 18.52043,
  lng: 73.85674
};

export default function AcceptOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [map, setMap] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [deliveryCoords, setDeliveryCoords] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBaKwXTqp_FqjrXUcUMrCJCvfS2xIR4MVk',
    libraries: libraries,
    region: "IN"
  });

  // Get shipmentId from location state or route
  const shipmentId = location.state?.shipmentId || location.state?.orderId;

  useEffect(() => {
    if (shipmentId) {
      handleAcceptOrder(shipmentId);
    } else {
      toast.error("No order selected");
      navigate("/partner-dashboard");
    }
  }, [shipmentId]);

  const handleAcceptOrder = async (orderId) => {
    try {
      setAccepting(true);
      const resp = await acceptOrder(orderId);
      
      if (resp?.data?.message && !resp.data.message.includes("successfully")) {
        toast.error(resp.data.message);
        navigate("/partner-dashboard");
        return;
      }

      if (resp?.data) {
        setOrderData(resp.data);
        // Geocode addresses to get coordinates
        if (isLoaded && window.google) {
          await geocodeAddresses(resp.data.pickupAddress, resp.data.deliveryAddress);
        }
      } else {
        toast.error("Failed to accept order");
        navigate("/partner-dashboard");
      }
    } catch (error) {
      console.error("Error accepting order:", error);
      toast.error(error.response?.data?.message || "Failed to accept order");
      navigate("/partner-dashboard");
    } finally {
      setAccepting(false);
      setLoading(false);
    }
  };

  const geocodeAddresses = async (pickupAddr, deliveryAddr) => {
    if (!window.google || !window.google.maps) return;

    const geocoder = new window.google.maps.Geocoder();

    try {
      // Geocode pickup address
      const pickupResult = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: pickupAddr }, (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0].geometry.location);
          } else {
            reject(new Error('Pickup geocoding failed'));
          }
        });
      });

      // Geocode delivery address
      const deliveryResult = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: deliveryAddr }, (results, status) => {
          if (status === 'OK' && results[0]) {
            resolve(results[0].geometry.location);
          } else {
            reject(new Error('Delivery geocoding failed'));
          }
        });
      });

      setPickupCoords({ lat: pickupResult.lat(), lng: pickupResult.lng() });
      setDeliveryCoords({ lat: deliveryResult.lat(), lng: deliveryResult.lng() });

      // Calculate route
      if (pickupResult && deliveryResult) {
        calculateRoute(pickupResult, deliveryResult);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      // Fallback: try to calculate route with addresses as strings
      if (pickupAddr && deliveryAddr) {
        calculateRouteFromAddresses(pickupAddr, deliveryAddr);
      }
    }
  };

  const calculateRouteFromAddresses = async (pickupAddr, deliveryAddr) => {
    if (!window.google || !window.google.maps) return;

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await new Promise((resolve, reject) => {
        directionsService.route({
          origin: pickupAddr,
          destination: deliveryAddr,
          travelMode: window.google.maps.TravelMode.DRIVING
        }, (result, status) => {
          if (status === 'OK') {
            resolve(result);
          } else {
            reject(new Error('Directions request failed'));
          }
        });
      });

      setDirectionsResponse(results);
      const distanceValue = results.routes[0].legs[0].distance.value / 1000; // in km
      const durationText = results.routes[0].legs[0].duration.text;
      setDistance(distanceValue);
      setDuration(durationText);

      // Update map center to show the route
      if (map && results.routes[0].bounds) {
        map.fitBounds(results.routes[0].bounds);
      }
    } catch (error) {
      console.error("Route calculation error:", error);
    }
  };

  const calculateRoute = async (pickupLoc, deliveryLoc) => {
    if (!window.google || !window.google.maps) return;

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const results = await new Promise((resolve, reject) => {
        directionsService.route({
          origin: pickupLoc,
          destination: deliveryLoc,
          travelMode: window.google.maps.TravelMode.DRIVING
        }, (result, status) => {
          if (status === 'OK') {
            resolve(result);
          } else {
            reject(new Error('Directions request failed'));
          }
        });
      });

      setDirectionsResponse(results);
      const distanceValue = results.routes[0].legs[0].distance.value / 1000; // in km
      const durationText = results.routes[0].legs[0].duration.text;
      setDistance(distanceValue);
      setDuration(durationText);

      // Update map center to show the route
      if (map && results.routes[0].bounds) {
        map.fitBounds(results.routes[0].bounds);
      }
    } catch (error) {
      console.error("Route calculation error:", error);
    }
  };

  useEffect(() => {
    if (isLoaded && orderData && orderData.pickupAddress && orderData.deliveryAddress) {
      geocodeAddresses(orderData.pickupAddress, orderData.deliveryAddress);
    }
  }, [isLoaded, orderData]);

  const handleBack = () => {
    navigate("/partner-dashboard");
  };

  const handleStartNavigation = () => {
    if (orderData?.pickupAddress) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(orderData.pickupAddress)}`;
      window.open(url, '_blank');
    }
  };

  const handleReachedPickup = () => {
    toast.success("Pickup location reached!");
    // TODO: Update shipment status to IN_TRANSIT
  };

  const handleCallCustomer = () => {
    if (orderData?.customerPhone) {
      window.location.href = `tel:${orderData.customerPhone}`;
    }
  };

  const getMapCenter = () => {
    if (pickupCoords) return pickupCoords;
    if (deliveryCoords) return deliveryCoords;
    return mapCenter;
  };

  if (loading || accepting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{accepting ? "Accepting order..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No order data available</p>
          <button onClick={handleBack} className="mt-4 text-blue-600 hover:underline">
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const user = { name: "Partner" };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <span className="font-semibold text-gray-800">
                Order #{orderData.shipmentId}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <span className="text-sm font-medium">{orderData.status || "ASSIGNED"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Live Navigation</h3>
                {distance && duration && (
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span>{distance.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>ETA: {duration}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Google Map */}
              {isLoaded ? (
                <div className="relative h-96">
                  <GoogleMap
                    center={getMapCenter()}
                    zoom={pickupCoords && deliveryCoords ? 12 : 15}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    onLoad={setMap}
                    options={{
                      zoomControl: true,
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: true,
                    }}
                  >
                    {directionsResponse && (
                      <DirectionsRenderer
                        directions={directionsResponse}
                        options={{
                          suppressMarkers: false,
                          preserveViewport: false,
                          polylineOptions: {
                            strokeColor: '#3B82F6',
                            strokeWeight: 5,
                          },
                        }}
                      />
                    )}
                    {!directionsResponse && pickupCoords && (
                      <Marker
                        position={pickupCoords}
                        label="P"
                        icon={{
                          url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                        }}
                      />
                    )}
                    {!directionsResponse && deliveryCoords && (
                      <Marker
                        position={deliveryCoords}
                        label="D"
                        icon={{
                          url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        }}
                      />
                    )}
                  </GoogleMap>
                </div>
              ) : (
                <div className="relative h-96 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
                    <p className="text-gray-500 text-sm font-medium">Loading Google Maps...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Order Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="font-semibold text-gray-800">Order Details</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Package Type</span>
                  <span className="text-sm font-medium text-gray-800">{orderData.packageType || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Weight</span>
                  <span className="text-sm font-medium text-gray-800">{orderData.weightKg ? `${orderData.weightKg} kg` : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Distance</span>
                  <span className="text-sm font-medium text-gray-800">{orderData.distanceKm ? `${orderData.distanceKm.toFixed(1)} km` : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment</span>
                  <span className="text-sm font-semibold text-green-600">₹{orderData.calculatedPrice ? orderData.calculatedPrice.toFixed(0) : "0"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vehicle</span>
                  <span className="text-sm font-medium text-gray-800">{orderData.vehicleTypeName || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="font-semibold text-gray-800">Customer Details</h3>
              </div>
              <div className="mb-3">
                <p className="font-medium text-gray-800">{orderData.customerName || "N/A"}</p>
                <p className="text-sm text-gray-600">{orderData.customerPhone || "N/A"}</p>
              </div>
              <button
                onClick={handleCallCustomer}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Customer
              </button>
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Addresses</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 mb-1">Pickup</p>
                    <p className="text-sm text-gray-600">{orderData.pickupAddress || "N/A"}</p>
                    {orderData.pickupContactName && (
                      <p className="text-xs text-gray-500 mt-1">Contact: {orderData.pickupContactName} - {orderData.pickupPhone}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 mb-1">Drop</p>
                    <p className="text-sm text-gray-600">{orderData.deliveryAddress || "N/A"}</p>
                    {orderData.deliveryContactName && (
                      <p className="text-xs text-gray-500 mt-1">Contact: {orderData.deliveryContactName} - {orderData.deliveryPhone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleStartNavigation}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Start Navigation
              </button>
              <button
                onClick={handleReachedPickup}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                I've Reached Pickup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
