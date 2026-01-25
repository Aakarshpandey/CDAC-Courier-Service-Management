# Courier Service Management System - API Documentation
**Based on Actual Backend Entity Schema**

## Overview
This document provides a comprehensive list of REST APIs required for the Courier Service Management System. The APIs are designed to align with the actual backend entity structure and database schema.

**Base URL**: `http://localhost:8080/api`  
**Authentication**: JWT Bearer Token (except for public endpoints)  
**Date Format**: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

---

## Database Schema Summary

### Core Entities
- **User**: Users of the system (customers)
- **Partner**: Delivery partners with vehicle information
- **Shipment**: Delivery orders/bookings
- **Location**: Pickup and delivery locations with coordinates
- **VehicleType**: Vehicle types with pricing (baseFare, perKmRate, maxWeightKg)
- **Payment**: Payment transactions for shipments
- **Rating**: Customer ratings for partners
- **ShipmentTracking**: Status tracking history for shipments
- **PartnerLocation**: Real-time partner location tracking
- **PartnerPayout**: Partner earnings and payouts
- **SystemLog**: System audit logs

### Enums
- **Role**: ROLE_ADMIN, ROLE_USER, ROLE_PARTNER
- **Status**: PENDING, ASSIGNED, IN_TRANSIT, DELIVERED, CANCELLED
- **PackageType**: DOCUMENTS, FOOD, ELECTRONICS, CLOTHING, GIFTS, OTHER
- **PaymentMethod**: UPI, CREDIT_CARD, DEBIT_CARD, NET_BANKING, CASH
- **PaymentStatus**: PENDING, PROCESSING, PAID, FAILED
- **PartnerStatus**: ACTIVE, INACTIVE, SUSPENDED, DELETED

---

## Table of Contents
1. [Authentication & User Management](#1-authentication--user-management)
2. [User Profile Management](#2-user-profile-management)
3. [Partner Management](#3-partner-management)
4. [Shipment Management](#4-shipment-management)
5. [Partner Order Management](#5-partner-order-management)
6. [Partner Earnings & Payouts](#6-partner-earnings--payouts)
7. [Vehicle Type & Pricing](#7-vehicle-type--pricing)
8. [Rating & Review](#8-rating--review)
9. [Payment Management](#9-payment-management)
10. [Tracking & Location](#10-tracking--location)
11. [Admin Dashboard](#11-admin-dashboard)

---

## 1. Authentication & User Management

### 1.1 User Registration
**Endpoint**: `POST /register`  
**Description**: Register a new user account  
**Authentication**: None

**Request Body**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "password": "string"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Registration successful",
  "data": {
    "userId": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string"
  }
}
```

---

### 1.2 User Login
**Endpoint**: `POST /login`  
**Description**: Authenticate user/partner and return JWT token  
**Authentication**: None

**Request Body**:
```json
{
  "email": "string",
  "password": "string",
  "loginType": "ROLE_USER | ROLE_PARTNER",
  "rememberMe": "boolean"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Login successful",
  "token": "string (JWT)",
  "email": "string",
  "role": "string",
  "firstName": "string",
  "lastName": "string"
}
```

---

### 1.3 OAuth2 Google Login
**Endpoint**: `GET /oauth2/authorization/google`  
**Description**: Initiate Google OAuth2 authentication flow  
**Authentication**: None

**Response**: Redirect to Google authentication page

---

### 1.4 OAuth2 Callback
**Endpoint**: `GET /auth-callback`  
**Description**: Handle OAuth2 callback and create session  
**Authentication**: None

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "token": "string (JWT)",
  "email": "string",
  "role": "string",
  "firstName": "string",
  "lastName": "string"
}
```

---

## 2. User Profile Management

### 2.1 Get User Profile
**Endpoint**: `GET /api/users/profile`  
**Description**: Retrieve authenticated user's profile information  
**Authentication**: Required (JWT)

**Response** (200 OK):
```json
{
  "userId": "string",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "dob": "string",
  "gender": "string",
  "address": "string",
  "landmark": "string",
  "city": "string",
  "state": "string",
  "pincode": "string",
  "emergencyContact": {
    "name": "string",
    "phone": "string",
    "relationship": "string"
  },
  "notifications": {
    "email": "boolean",
    "sms": "boolean",
    "whatsapp": "boolean",
    "promotional": "boolean"
  },
  "profilePicture": "string (URL)"
}
```

---

### 2.2 Update User Profile
**Endpoint**: `PUT /api/users/profile`  
**Description**: Update user profile information  
**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "dob": "string",
  "gender": "string",
  "address": "string",
  "landmark": "string",
  "city": "string",
  "state": "string",
  "pincode": "string",
  "emergencyName": "string",
  "emergencyPhone": "string",
  "relationship": "string"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Profile updated successfully",
  "data": { /* Updated profile object */ }
}
```

---

### 2.3 Update User Notification Preferences
**Endpoint**: `PUT /api/users/notifications`  
**Description**: Update notification preferences  
**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "emailNotifications": "boolean",
  "smsNotifications": "boolean",
  "whatsappNotifications": "boolean",
  "promotionalEmails": "boolean"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Notification preferences updated"
}
```

---

### 2.4 Change Password
**Endpoint**: `PUT /api/users/password`  
**Description**: Change user password  
**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Password changed successfully"
}
```

---

### 2.5 Upload Profile Picture
**Endpoint**: `POST /api/users/profile-picture`  
**Description**: Upload user profile picture  
**Authentication**: Required (JWT)  
**Content-Type**: multipart/form-data

**Request Body**:
```
file: <image file> (max 2MB, JPG/PNG/GIF)
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Profile picture uploaded",
  "imageUrl": "string"
}
```

---

## 3. Partner Profile Management

### 3.1 Get Partner Profile
**Endpoint**: `GET /api/partners/profile`  
**Description**: Retrieve partner's profile information  
**Authentication**: Required (JWT - Partner role)

**Response** (200 OK):
```json
{
  "partnerId": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "vehicleType": "string",
  "vehicleModel": "string",
  "vehicleNumber": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "pincode": "string",
  "rating": "number",
  "totalDeliveries": "number",
  "profilePicture": "string (URL)"
}
```

---

### 3.2 Update Partner Profile
**Endpoint**: `PUT /api/partners/profile`  
**Description**: Update partner profile  
**Authentication**: Required (JWT - Partner role)

**Request Body**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "vehicleType": "string",
  "vehicleModel": "string",
  "vehicleNumber": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "pincode": "string"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Profile updated successfully",
  "data": { /* Updated profile object */ }
}
```

---

### 3.3 Upload Partner Profile Picture
**Endpoint**: `POST /api/partners/profile-picture`  
**Description**: Upload partner profile picture  
**Authentication**: Required (JWT - Partner role)  
**Content-Type**: multipart/form-data

**Request Body**:
```
file: <image file> (max 2MB, JPG/PNG/GIF)
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Profile picture uploaded",
  "imageUrl": "string"
}
```

---

## 4. Booking/Order Management

### 4.1 Create Booking
**Endpoint**: `POST /api/bookings`  
**Description**: Create a new delivery booking  
**Authentication**: Required (JWT - User role)

**Request Body**:
```json
{
  "pickup": {
    "address": "string",
    "landmark": "string",
    "contactName": "string",
    "phone": "string",
    "pincode": "string"
  },
  "delivery": {
    "address": "string",
    "landmark": "string",
    "contactName": "string",
    "phone": "string",
    "pincode": "string"
  },
  "package": {
    "type": "documents | food | electronics | clothing | gifts | other",
    "weight": "number",
    "declaredValue": "number",
    "description": "string"
  },
  "vehicleType": "bike | car | small-truck | large-truck",
  "scheduleOption": "asap | scheduled",
  "scheduledTime": "string (ISO 8601, optional)",
  "paymentMethod": "online | cod"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Booking created successfully",
  "data": {
    "bookingId": "string",
    "trackingId": "string",
    "estimatedPrice": "number",
    "estimatedTime": "string",
    "status": "PENDING"
  }
}
```

---

### 4.2 Get User Bookings
**Endpoint**: `GET /api/users/bookings`  
**Description**: Get all bookings for authenticated user  
**Authentication**: Required (JWT - User role)

**Query Parameters**:
- `status` (optional): PENDING | ACCEPTED | IN_TRANSIT | DELIVERED | CANCELLED
- `page` (default: 0): Page number
- `limit` (default: 10): Items per page

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "data": {
    "bookings": [
      {
        "bookingId": "string",
        "trackingId": "string",
        "status": "string",
        "pickupAddress": "string",
        "deliveryAddress": "string",
        "packageType": "string",
        "vehicleType": "string",
        "totalPrice": "number",
        "createdAt": "string",
        "estimatedDelivery": "string"
      }
    ],
    "totalCount": "number",
    "currentPage": "number",
    "totalPages": "number"
  }
}
```

---

### 4.3 Get Booking Details
**Endpoint**: `GET /api/bookings/{bookingId}`  
**Description**: Get detailed information about a specific booking  
**Authentication**: Required (JWT)

**Response** (200 OK):
```json
{
  "bookingId": "string",
  "trackingId": "string",
  "status": "string",
  "pickup": {
    "address": "string",
    "landmark": "string",
    "contactName": "string",
    "phone": "string",
    "pincode": "string"
  },
  "delivery": {
    "address": "string",
    "landmark": "string",
    "contactName": "string",
    "phone": "string",
    "pincode": "string"
  },
  "package": {
    "type": "string",
    "weight": "number",
    "declaredValue": "number",
    "description": "string"
  },
  "vehicleType": "string",
  "pricing": {
    "basePrice": "number",
    "distanceCharge": "number",
    "totalPrice": "number"
  },
  "partner": {
    "partnerId": "string",
    "name": "string",
    "phone": "string",
    "vehicleNumber": "string",
    "rating": "number"
  },
  "timeline": [
    {
      "status": "string",
      "timestamp": "string",
      "location": "string"
    }
  ],
  "createdAt": "string",
  "estimatedDelivery": "string"
}
```

---

### 4.4 Track Package
**Endpoint**: `GET /api/bookings/track/{trackingId}`  
**Description**: Track package by tracking ID  
**Authentication**: None (Public endpoint)

**Response** (200 OK):
```json
{
  "trackingId": "string",
  "status": "string",
  "currentLocation": {
    "latitude": "number",
    "longitude": "number",
    "address": "string"
  },
  "estimatedDelivery": "string",
  "partner": {
    "name": "string",
    "vehicleNumber": "string",
    "rating": "number"
  },
  "timeline": [
    {
      "status": "string",
      "timestamp": "string",
      "completed": "boolean"
    }
  ]
}
```

---

### 4.5 Cancel Booking
**Endpoint**: `PUT /api/bookings/{bookingId}/cancel`  
**Description**: Cancel a booking  
**Authentication**: Required (JWT - User role)

**Request Body**:
```json
{
  "reason": "string"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Booking cancelled successfully",
  "refundAmount": "number"
}
```

---

## 5. Partner Order Management

### 5.1 Get Available Orders
**Endpoint**: `GET /api/partners/orders/available`  
**Description**: Get list of available orders for partner to accept  
**Authentication**: Required (JWT - Partner role)

**Query Parameters**:
- `vehicleType` (optional): Filter by vehicle type
- `latitude` (optional): Partner's current latitude
- `longitude` (optional): Partner's current longitude
- `radius` (default: 10): Search radius in km

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "orderId": "string",
      "pickupTime": "string",
      "pickup": {
        "address": "string",
        "latitude": "number",
        "longitude": "number"
      },
      "drop": {
        "address": "string",
        "latitude": "number",
        "longitude": "number"
      },
      "packageType": "string",
      "weight": "number",
      "distance": "number",
      "estimatedEarnings": "number",
      "estimatedTime": "string"
    }
  ]
}
```

---

### 5.2 Accept Order
**Endpoint**: `POST /api/partners/orders/{orderId}/accept`  
**Description**: Accept an available order  
**Authentication**: Required (JWT - Partner role)

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Order accepted successfully",
  "data": {
    "orderId": "string",
    "customerName": "string",
    "customerPhone": "string",
    "pickup": { /* Full pickup details */ },
    "drop": { /* Full drop details */ },
    "navigationUrl": "string"
  }
}
```

---

### 5.3 Get Partner Active Orders
**Endpoint**: `GET /api/partners/orders/active`  
**Description**: Get partner's current active orders  
**Authentication**: Required (JWT - Partner role)

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "data": [
    {
      "orderId": "string",
      "status": "string",
      "pickup": { /* Pickup details */ },
      "drop": { /* Drop details */ },
      "customer": {
        "name": "string",
        "phone": "string"
      },
      "packageType": "string",
      "weight": "number",
      "earnings": "number"
    }
  ]
}
```

---

### 5.4 Update Order Status
**Endpoint**: `PUT /api/partners/orders/{orderId}/status`  
**Description**: Update order status  
**Authentication**: Required (JWT - Partner role)

**Request Body**:
```json
{
  "status": "HEADING_TO_PICKUP | REACHED_PICKUP | PICKED_UP | IN_TRANSIT | DELIVERED",
  "location": {
    "latitude": "number",
    "longitude": "number"
  },
  "timestamp": "string"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Order status updated"
}
```

---

### 5.5 Complete Delivery
**Endpoint**: `POST /api/partners/orders/{orderId}/complete`  
**Description**: Mark delivery as completed  
**Authentication**: Required (JWT - Partner role)  
**Content-Type**: multipart/form-data

**Request Body**:
```
deliveryProof: <image file> (optional)
signature: <string> (optional)
deliveredAt: <string (ISO 8601)>
notes: <string> (optional)
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Delivery completed successfully",
  "earnings": "number"
}
```

---

## 6. Partner Dashboard & Earnings

### 6.1 Get Partner Dashboard Stats
**Endpoint**: `GET /api/partners/dashboard/stats`  
**Description**: Get partner dashboard statistics  
**Authentication**: Required (JWT - Partner role)

**Response** (200 OK):
```json
{
  "ordersToday": "number",
  "totalEarnings": "number",
  "todayEarnings": "number",
  "distanceCovered": "number",
  "rating": "number",
  "onlineTime": "string",
  "completionRate": "number"
}
```

---

### 6.2 Get Partner Earnings
**Endpoint**: `GET /api/partners/earnings`  
**Description**: Get detailed earnings information  
**Authentication**: Required (JWT - Partner role)

**Query Parameters**:
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)
- `period` (optional): daily | weekly | monthly
- `page` (default: 0): Page number
- `limit` (default: 10): Items per page

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "data": {
    "totalEarnings": "number",
    "breakdown": [
      {
        "date": "string",
        "orders": "number",
        "earnings": "number",
        "distance": "number"
      }
    ],
    "totalCount": "number",
    "currentPage": "number",
    "totalPages": "number"
  }
}
```

---

### 6.3 Get Partner Order History
**Endpoint**: `GET /api/partners/orders/history`  
**Description**: Get completed order history  
**Authentication**: Required (JWT - Partner role)

**Query Parameters**:
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)
- `page` (default: 0): Page number
- `limit` (default: 10): Items per page

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "data": {
    "orders": [
      {
        "orderId": "string",
        "completedAt": "string",
        "pickup": "string",
        "drop": "string",
        "distance": "number",
        "earnings": "number",
        "rating": "number"
      }
    ],
    "totalCount": "number",
    "currentPage": "number",
    "totalPages": "number"
  }
}
```

---

## 7. Price Calculation

### 7.1 Calculate Delivery Price
**Endpoint**: `POST /api/pricing/calculate`  
**Description**: Calculate delivery price based on distance and vehicle type  
**Authentication**: None (Public endpoint)

**Request Body**:
```json
{
  "pickupAddress": "string",
  "deliveryAddress": "string",
  "weight": "number",
  "vehicleType": "bike | car | small-truck | large-truck",
  "packageType": "string"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "data": {
    "basePrice": "number",
    "distanceCharge": "number",
    "totalPrice": "number",
    "distance": "number",
    "estimatedTime": "string",
    "vehicleName": "string"
  }
}
```

---

## 8. Admin Dashboard

### 8.1 Get Admin Dashboard Stats
**Endpoint**: `GET /api/admin/dashboard/stats`  
**Description**: Get overall system statistics  
**Authentication**: Required (JWT - Admin role)

**Response** (200 OK):
```json
{
  "totalOrders": "number",
  "activeOrders": "number",
  "completedOrders": "number",
  "totalUsers": "number",
  "totalPartners": "number",
  "activePartners": "number",
  "totalRevenue": "number",
  "todayRevenue": "number"
}
```

---

### 8.2 Get All Orders
**Endpoint**: `GET /api/admin/orders`  
**Description**: Get all orders in the system  
**Authentication**: Required (JWT - Admin role)

**Query Parameters**:
- `status` (optional): Filter by status
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)
- `page` (default: 0): Page number
- `limit` (default: 10): Items per page

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "data": {
    "orders": [ /* Array of order objects */ ],
    "totalCount": "number",
    "currentPage": "number",
    "totalPages": "number"
  }
}
```

---

### 8.3 Get All Users
**Endpoint**: `GET /api/admin/users`  
**Description**: Get all registered users  
**Authentication**: Required (JWT - Admin role)

**Query Parameters**:
- `page` (default: 0): Page number
- `limit` (default: 10): Items per page
- `search` (optional): Search by name or email

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "data": {
    "users": [
      {
        "userId": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "totalOrders": "number",
        "registeredAt": "string"
      }
    ],
    "totalCount": "number",
    "currentPage": "number",
    "totalPages": "number"
  }
}
```

---

### 8.4 Get All Partners
**Endpoint**: `GET /api/admin/partners`  
**Description**: Get all registered partners  
**Authentication**: Required (JWT - Admin role)

**Query Parameters**:
- `status` (optional): ACTIVE | INACTIVE | SUSPENDED
- `vehicleType` (optional): Filter by vehicle type
- `page` (default: 0): Page number
- `limit` (default: 10): Items per page

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "data": {
    "partners": [
      {
        "partnerId": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "vehicleType": "string",
        "vehicleNumber": "string",
        "rating": "number",
        "totalDeliveries": "number",
        "status": "string",
        "registeredAt": "string"
      }
    ],
    "totalCount": "number",
    "currentPage": "number",
    "totalPages": "number"
  }
}
```

---

## 9. Real-time Location & Tracking

### 9.1 Update Partner Location
**Endpoint**: `POST /api/partners/location`  
**Description**: Update partner's real-time location  
**Authentication**: Required (JWT - Partner role)

**Request Body**:
```json
{
  "latitude": "number",
  "longitude": "number",
  "timestamp": "string (ISO 8601)"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Location updated"
}
```

---

### 9.2 Get Live Tracking
**Endpoint**: `GET /api/bookings/{bookingId}/live-tracking`  
**Description**: Get real-time tracking information  
**Authentication**: Required (JWT)

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "data": {
    "orderId": "string",
    "currentStatus": "string",
    "partnerLocation": {
      "latitude": "number",
      "longitude": "number",
      "lastUpdated": "string"
    },
    "estimatedArrival": "string",
    "route": [
      {
        "latitude": "number",
        "longitude": "number"
      }
    ]
  }
}
```

---

## 10. Communication

### 10.1 Call Customer/Partner
**Endpoint**: `POST /api/communication/call`  
**Description**: Initiate call between customer and partner (masked numbers)  
**Authentication**: Required (JWT)

**Request Body**:
```json
{
  "orderId": "string",
  "callerType": "USER | PARTNER"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Call initiated",
  "callSessionId": "string",
  "maskedNumber": "string"
}
```

---

### 10.2 Send Notification
**Endpoint**: `POST /api/notifications/send`  
**Description**: Send notification to user/partner  
**Authentication**: Required (JWT - Admin/System role)

**Request Body**:
```json
{
  "recipientId": "string",
  "recipientType": "USER | PARTNER",
  "notificationType": "EMAIL | SMS | WHATSAPP | PUSH",
  "subject": "string",
  "message": "string",
  "data": "object (optional)"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Notification sent",
  "notificationId": "string"
}
```

---

## Common Response Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource |
| 500 | Internal Server Error |

---

## Error Response Format

All error responses follow this format:

```json
{
  "status": "ERROR",
  "message": "Error description",
  "errors": [
    {
      "field": "string",
      "message": "string"
    }
  ],
  "timestamp": "string (ISO 8601)"
}
```

---

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

The JWT token is obtained from the login endpoint and should be stored securely on the client side.

---

## Rate Limiting

- **General APIs**: 100 requests per minute per user
- **Location Updates**: 60 requests per minute per partner
- **Public APIs** (tracking, pricing): 30 requests per minute per IP

---

## WebSocket Support (Optional)

For real-time features, consider implementing WebSocket endpoints:

- `/ws/tracking/{bookingId}` - Real-time order tracking
- `/ws/partner/location` - Partner location updates
- `/ws/notifications` - Real-time notifications

---

## Notes

1. All timestamps should be in ISO 8601 format
2. All monetary values are in INR (₹)
3. Distance is measured in kilometers
4. Weight is measured in kilograms
5. Phone numbers should include country code (+91 for India)
6. Pagination starts from page 0

---

**Document Version**: 1.0  
**Last Updated**: January 25, 2026  
**Total APIs**: 34
