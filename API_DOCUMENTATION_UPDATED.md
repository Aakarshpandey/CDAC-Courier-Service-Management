# Courier Service Management System - API Documentation
**Aligned with Backend Entity Schema**

## Overview
This document provides REST APIs for the Courier Service Management System based on the actual backend entity structure. All APIs are designed to work with the existing database schema.

**Base URL**: `http://localhost:8080/api`  
**Authentication**: JWT Bearer Token (except for public endpoints)  
**Date Format**: ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)

---

## Database Schema Summary

### Core Entities
| Entity | Description | Key Fields |
|--------|-------------|------------|
| **User** | System users (customers) | id, email, password, firstName, lastName, phoneNumber, profilePhotoUrl, role, createdAt |
| **Partner** | Delivery partners | partnerId, userId, vehicleTypeId, vehicleRegNumber, vehicleModel, drivingLicenseNumber, driverAddress, pincode, preferredCity, panNumber, bankAccountNumber, aadharNumber, validInsurance, isApproved, isOnline, avgRating, status |
| **Shipment** | Delivery orders | shipmentId, customerId, partnerId, vehicleTypeId, pickupLocationId, deliveryLocationId, packageType, packageDescription, weightKg, declaredValue, pickup/delivery details, distanceKm, calculatedPrice, status, paymentStatus, timestamps |
| **Location** | Geographic locations | id, city, pincode, lat, lng |
| **VehicleType** | Vehicle categories | id, typeName, baseFare, perKmRate, maxWeightKg |
| **Payment** | Payment transactions | paymentId, shipmentId, amount, paymentMethod, transactionGatewayId, status, createdAt |
| **Rating** | Partner ratings | ratingId, shipmentId, userId, partnerId, rating (1-5), review, createdAt |
| **ShipmentTracking** | Tracking history | trackingId, shipmentId, status, location, notes, timestamp |
| **PartnerLocation** | Real-time partner GPS | id, partnerId, lat, lng, isOnline, timestamp |
| **PartnerPayout** | Partner earnings | payoutId, partnerId, shipmentId, amount, paymentStatus, paidAt |
| **SystemLog** | Audit logs | logId, userId, action, entity, entityId, timestamp |

### Enums
- **Role**: `ROLE_ADMIN`, `ROLE_USER`, `ROLE_PARTNER`
- **Status**: `PENDING`, `ASSIGNED`, `IN_TRANSIT`, `DELIVERED`, `CANCELLED`
- **PackageType**: `DOCUMENTS`, `FOOD`, `ELECTRONICS`, `CLOTHING`, `GIFTS`, `OTHER`
- **PaymentMethod**: `UPI`, `CREDIT_CARD`, `DEBIT_CARD`, `NET_BANKING`, `CASH`
- **PaymentStatus**: `PENDING`, `PROCESSING`, `PAID`, `FAILED`
- **PartnerStatus**: `ACTIVE`, `INACTIVE`, `SUSPENDED`, `DELETED`

---

## API Endpoints

### 1. Authentication & User Management

#### 1.1 User Registration
```http
POST /register
```
Register a new user account

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
  "userId": "long",
  "email": "string"
}
```

---

#### 1.2 User Login
```http
POST /login
```
Authenticate user and return JWT token

**Request Body**:
```json
{
  "email": "string",
  "password": "string",
  "loginType": "ROLE_USER | ROLE_PARTNER | ROLE_ADMIN",
  "rememberMe": "boolean"
}
```

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

#### 1.3 OAuth2 Google Login
```http
GET /oauth2/authorization/google
```
Initiate Google OAuth2 authentication

**Response**: Redirect to Google authentication

---

#### 1.4 OAuth2 Callback
```http
GET /auth-callback
```
Handle OAuth2 callback

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "token": "string (JWT)",
  "user": { /* User object */ }
}
```

---

### 2. User Profile Management

#### 2.1 Get User Profile
```http
GET /api/users/profile
```
**Auth**: Required (JWT)

**Response** (200 OK):
```json
{
  "id": "long",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string",
  "profilePhotoUrl": "string",
  "role": "ROLE_USER",
  "createdAt": "timestamp"
}
```

---

#### 2.2 Update User Profile
```http
PUT /api/users/profile
```
**Auth**: Required (JWT)

**Request Body**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string",
  "profilePhotoUrl": "string"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Profile updated",
  "user": { /* Updated user object */ }
}
```

---

#### 2.3 Upload Profile Photo
```http
POST /api/users/profile-photo
```
**Auth**: Required (JWT)  
**Content-Type**: multipart/form-data

**Request**: File upload (max 2MB)

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "profilePhotoUrl": "string"
}
```

---

#### 2.4 Change Password
```http
PUT /api/users/password
```
**Auth**: Required (JWT)

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

### 3. Partner Management

#### 3.1 Register as Partner
```http
POST /api/partners/register
```
**Auth**: Required (JWT - User role)

**Request Body**:
```json
{
  "vehicleTypeId": "long",
  "vehicleRegNumber": "string",
  "vehicleModel": "string",
  "drivingLicenseNumber": "string",
  "driverAddress": "string",
  "pincode": "integer",
  "preferredCity": "string",
  "panNumber": "string",
  "bankAccountNumber": "long",
  "aadharNumber": "long",
  "validInsurance": "boolean"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Partner registration submitted for approval",
  "partnerId": "long"
}
```

---

#### 3.2 Get Partner Profile
```http
GET /api/partners/profile
```
**Auth**: Required (JWT - Partner role)

**Response** (200 OK):
```json
{
  "partnerId": "long",
  "user": {
    "id": "long",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phoneNumber": "string",
    "profilePhotoUrl": "string"
  },
  "vehicleType": {
    "id": "long",
    "typeName": "string",
    "baseFare": "double",
    "perKmRate": "double",
    "maxWeightKg": "double"
  },
  "vehicleRegNumber": "string",
  "vehicleModel": "string",
  "drivingLicenseNumber": "string",
  "driverAddress": "string",
  "pincode": "integer",
  "preferredCity": "string",
  "isApproved": "boolean",
  "isOnline": "boolean",
  "avgRating": "double",
  "status": "ACTIVE | INACTIVE | SUSPENDED | DELETED"
}
```

---

#### 3.3 Update Partner Profile
```http
PUT /api/partners/profile
```
**Auth**: Required (JWT - Partner role)

**Request Body**:
```json
{
  "vehicleRegNumber": "string",
  "vehicleModel": "string",
  "driverAddress": "string",
  "pincode": "integer",
  "preferredCity": "string",
  "bankAccountNumber": "long"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Profile updated",
  "partner": { /* Updated partner object */ }
}
```

---

#### 3.4 Toggle Partner Online Status
```http
PUT /api/partners/online-status
```
**Auth**: Required (JWT - Partner role)

**Request Body**:
```json
{
  "isOnline": "boolean"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "isOnline": "boolean"
}
```

---

### 4. Shipment Management

#### 4.1 Create Shipment
```http
POST /api/shipments
```
**Auth**: Required (JWT - User role)

**Request Body**:
```json
{
  "vehicleTypeId": "long",
  "pickupLocationId": "long",
  "deliveryLocationId": "long",
  "packageType": "DOCUMENTS | FOOD | ELECTRONICS | CLOTHING | GIFTS | OTHER",
  "packageDescription": "string",
  "weightKg": "decimal",
  "declaredValue": "decimal",
  "pickupAddress": "string",
  "pickupLandmark": "string",
  "pickupContactName": "string",
  "pickupPhone": "string",
  "deliveryAddress": "string",
  "deliveryLandmark": "string",
  "deliveryContactName": "string",
  "deliveryPhone": "string"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Shipment created",
  "shipment": {
    "shipmentId": "long",
    "status": "PENDING",
    "calculatedPrice": "decimal",
    "distanceKm": "decimal",
    "createdAt": "timestamp"
  }
}
```

---

#### 4.2 Get Shipment Details
```http
GET /api/shipments/{shipmentId}
```
**Auth**: Required (JWT)

**Response** (200 OK):
```json
{
  "shipmentId": "long",
  "customer": { /* User object */ },
  "partner": { /* Partner object (if assigned) */ },
  "vehicleType": { /* VehicleType object */ },
  "pickupLocation": { /* Location object */ },
  "deliveryLocation": { /* Location object */ },
  "packageType": "string",
  "packageDescription": "string",
  "weightKg": "decimal",
  "declaredValue": "decimal",
  "pickupAddress": "string",
  "pickupLandmark": "string",
  "pickupContactName": "string",
  "pickupPhone": "string",
  "deliveryAddress": "string",
  "deliveryLandmark": "string",
  "deliveryContactName": "string",
  "deliveryPhone": "string",
  "distanceKm": "decimal",
  "calculatedPrice": "decimal",
  "status": "PENDING | ASSIGNED | IN_TRANSIT | DELIVERED | CANCELLED",
  "paymentStatus": "PENDING | PROCESSING | PAID | FAILED",
  "createdAt": "timestamp",
  "pickedUpAt": "timestamp",
  "deliveredAt": "timestamp"
}
```

---

#### 4.3 Get User Shipments
```http
GET /api/shipments/user
```
**Auth**: Required (JWT - User role)

**Query Params**:
- `status` (optional): Filter by status
- `page` (default: 0)
- `size` (default: 10)

**Response** (200 OK):
```json
{
  "content": [ /* Array of shipment objects */ ],
  "totalElements": "long",
  "totalPages": "integer",
  "currentPage": "integer"
}
```

---

#### 4.4 Cancel Shipment
```http
PUT /api/shipments/{shipmentId}/cancel
```
**Auth**: Required (JWT - User role)

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
  "message": "Shipment cancelled"
}
```

---

### 5. Partner Order Management

#### 5.1 Get Available Shipments
```http
GET /api/partners/shipments/available
```
**Auth**: Required (JWT - Partner role)

**Query Params**:
- `lat` (required): Partner's latitude
- `lng` (required): Partner's longitude
- `radius` (default: 10): Search radius in km

**Response** (200 OK):
```json
{
  "shipments": [
    {
      "shipmentId": "long",
      "pickupAddress": "string",
      "deliveryAddress": "string",
      "packageType": "string",
      "weightKg": "decimal",
      "distanceKm": "decimal",
      "estimatedEarnings": "decimal",
      "pickupLocation": {
        "lat": "double",
        "lng": "double"
      }
    }
  ]
}
```

---

#### 5.2 Accept Shipment
```http
POST /api/partners/shipments/{shipmentId}/accept
```
**Auth**: Required (JWT - Partner role)

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Shipment accepted",
  "shipment": { /* Full shipment details */ }
}
```

---

#### 5.3 Get Partner Active Shipments
```http
GET /api/partners/shipments/active
```
**Auth**: Required (JWT - Partner role)

**Response** (200 OK):
```json
{
  "shipments": [ /* Array of active shipment objects */ ]
}
```

---

#### 5.4 Update Shipment Status
```http
PUT /api/partners/shipments/{shipmentId}/status
```
**Auth**: Required (JWT - Partner role)

**Request Body**:
```json
{
  "status": "ASSIGNED | IN_TRANSIT | DELIVERED",
  "location": "string (optional)",
  "notes": "string (optional)"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Status updated",
  "shipment": { /* Updated shipment */ }
}
```

---

#### 5.5 Complete Delivery
```http
POST /api/partners/shipments/{shipmentId}/complete
```
**Auth**: Required (JWT - Partner role)

**Request Body**:
```json
{
  "deliveryProof": "string (optional - image URL)",
  "notes": "string (optional)"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Delivery completed",
  "earnings": "decimal"
}
```

---

### 6. Partner Earnings & Payouts

#### 6.1 Get Partner Dashboard Stats
```http
GET /api/partners/dashboard/stats
```
**Auth**: Required (JWT - Partner role)

**Response** (200 OK):
```json
{
  "todayOrders": "integer",
  "todayEarnings": "decimal",
  "totalEarnings": "decimal",
  "pendingPayouts": "decimal",
  "completedDeliveries": "integer",
  "avgRating": "double",
  "onlineTime": "string"
}
```

---

#### 6.2 Get Partner Payouts
```http
GET /api/partners/payouts
```
**Auth**: Required (JWT - Partner role)

**Query Params**:
- `status` (optional): Filter by payment status
- `page` (default: 0)
- `size` (default: 10)

**Response** (200 OK):
```json
{
  "content": [
    {
      "payoutId": "long",
      "shipment": { /* Shipment summary */ },
      "amount": "double",
      "paymentStatus": "PENDING | PROCESSING | PAID | FAILED",
      "paidAt": "timestamp"
    }
  ],
  "totalElements": "long",
  "totalPages": "integer"
}
```

---

#### 6.3 Get Earnings History
```http
GET /api/partners/earnings/history
```
**Auth**: Required (JWT - Partner role)

**Query Params**:
- `startDate` (optional)
- `endDate` (optional)
- `page` (default: 0)
- `size` (default: 10)

**Response** (200 OK):
```json
{
  "totalEarnings": "decimal",
  "earnings": [
    {
      "date": "date",
      "orders": "integer",
      "amount": "decimal"
    }
  ]
}
```

---

### 7. Vehicle Type & Pricing

#### 7.1 Get All Vehicle Types
```http
GET /api/vehicle-types
```
**Auth**: None (Public)

**Response** (200 OK):
```json
{
  "vehicleTypes": [
    {
      "id": "long",
      "typeName": "string",
      "baseFare": "double",
      "perKmRate": "double",
      "maxWeightKg": "double"
    }
  ]
}
```

---

#### 7.2 Calculate Shipment Price
```http
POST /api/pricing/calculate
```
**Auth**: None (Public)

**Request Body**:
```json
{
  "pickupLocationId": "long",
  "deliveryLocationId": "long",
  "vehicleTypeId": "long",
  "weightKg": "decimal"
}
```

**Response** (200 OK):
```json
{
  "baseFare": "double",
  "distanceCharge": "double",
  "totalPrice": "double",
  "distanceKm": "double",
  "vehicleType": "string"
}
```

---

### 8. Rating & Review

#### 8.1 Submit Rating
```http
POST /api/ratings
```
**Auth**: Required (JWT - User role)

**Request Body**:
```json
{
  "shipmentId": "long",
  "partnerId": "long",
  "rating": "integer (1-5)",
  "review": "string (optional)"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Rating submitted",
  "ratingId": "long"
}
```

---

#### 8.2 Get Partner Ratings
```http
GET /api/partners/{partnerId}/ratings
```
**Auth**: None (Public)

**Query Params**:
- `page` (default: 0)
- `size` (default: 10)

**Response** (200 OK):
```json
{
  "avgRating": "double",
  "totalRatings": "integer",
  "ratings": [
    {
      "ratingId": "long",
      "user": {
        "firstName": "string",
        "lastName": "string"
      },
      "rating": "integer",
      "review": "string",
      "createdAt": "timestamp"
    }
  ]
}
```

---

### 9. Payment Management

#### 9.1 Create Payment
```http
POST /api/payments
```
**Auth**: Required (JWT - User role)

**Request Body**:
```json
{
  "shipmentId": "long",
  "amount": "decimal",
  "paymentMethod": "UPI | CREDIT_CARD | DEBIT_CARD | NET_BANKING | CASH"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "paymentId": "long",
  "transactionGatewayId": "string",
  "paymentStatus": "PENDING | PROCESSING"
}
```

---

#### 9.2 Get Payment Details
```http
GET /api/payments/{paymentId}
```
**Auth**: Required (JWT)

**Response** (200 OK):
```json
{
  "paymentId": "long",
  "shipment": { /* Shipment summary */ },
  "amount": "decimal",
  "paymentMethod": "string",
  "transactionGatewayId": "string",
  "status": "PENDING | PROCESSING | PAID | FAILED",
  "createdAt": "timestamp"
}
```

---

#### 9.3 Update Payment Status (Webhook)
```http
POST /api/payments/webhook
```
**Auth**: API Key

**Request Body**:
```json
{
  "transactionGatewayId": "string",
  "status": "PAID | FAILED",
  "metadata": "object"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS"
}
```

---

### 10. Tracking & Location

#### 10.1 Track Shipment
```http
GET /api/tracking/{shipmentId}
```
**Auth**: None (Public - with tracking ID)

**Response** (200 OK):
```json
{
  "shipmentId": "long",
  "status": "PENDING | ASSIGNED | IN_TRANSIT | DELIVERED | CANCELLED",
  "currentLocation": {
    "lat": "double",
    "lng": "double",
    "address": "string"
  },
  "trackingHistory": [
    {
      "trackingId": "long",
      "status": "string",
      "location": "string",
      "notes": "string",
      "timestamp": "timestamp"
    }
  ],
  "estimatedDelivery": "timestamp"
}
```

---

#### 10.2 Add Tracking Update
```http
POST /api/tracking
```
**Auth**: Required (JWT - Partner role)

**Request Body**:
```json
{
  "shipmentId": "long",
  "status": "ASSIGNED | IN_TRANSIT | DELIVERED",
  "location": "string",
  "notes": "string"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "trackingId": "long"
}
```

---

#### 10.3 Update Partner Location
```http
POST /api/partners/location
```
**Auth**: Required (JWT - Partner role)

**Request Body**:
```json
{
  "lat": "double",
  "lng": "double",
  "isOnline": "boolean"
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

#### 10.4 Get Partner Live Location
```http
GET /api/partners/{partnerId}/location
```
**Auth**: Required (JWT)

**Response** (200 OK):
```json
{
  "partnerId": "long",
  "lat": "double",
  "lng": "double",
  "isOnline": "boolean",
  "lastUpdated": "timestamp"
}
```

---

### 11. Admin Dashboard

#### 11.1 Get Admin Dashboard Stats
```http
GET /api/admin/dashboard/stats
```
**Auth**: Required (JWT - Admin role)

**Response** (200 OK):
```json
{
  "totalUsers": "integer",
  "totalPartners": "integer",
  "activePartners": "integer",
  "totalShipments": "integer",
  "pendingShipments": "integer",
  "inTransitShipments": "integer",
  "completedShipments": "integer",
  "totalRevenue": "decimal",
  "todayRevenue": "decimal"
}
```

---

#### 11.2 Get All Users
```http
GET /api/admin/users
```
**Auth**: Required (JWT - Admin role)

**Query Params**:
- `search` (optional)
- `page` (default: 0)
- `size` (default: 10)

**Response** (200 OK):
```json
{
  "content": [ /* Array of user objects */ ],
  "totalElements": "long",
  "totalPages": "integer"
}
```

---

#### 11.3 Get All Partners
```http
GET /api/admin/partners
```
**Auth**: Required (JWT - Admin role)

**Query Params**:
- `status` (optional): Filter by partner status
- `isApproved` (optional): Filter by approval status
- `page` (default: 0)
- `size` (default: 10)

**Response** (200 OK):
```json
{
  "content": [ /* Array of partner objects */ ],
  "totalElements": "long",
  "totalPages": "integer"
}
```

---

#### 11.4 Approve/Reject Partner
```http
PUT /api/admin/partners/{partnerId}/approval
```
**Auth**: Required (JWT - Admin role)

**Request Body**:
```json
{
  "isApproved": "boolean",
  "remarks": "string (optional)"
}
```

**Response** (200 OK):
```json
{
  "status": "SUCCESS",
  "message": "Partner approval status updated"
}
```

---

#### 11.5 Get All Shipments
```http
GET /api/admin/shipments
```
**Auth**: Required (JWT - Admin role)

**Query Params**:
- `status` (optional)
- `startDate` (optional)
- `endDate` (optional)
- `page` (default: 0)
- `size` (default: 10)

**Response** (200 OK):
```json
{
  "content": [ /* Array of shipment objects */ ],
  "totalElements": "long",
  "totalPages": "integer"
}
```

---

#### 11.6 Get System Logs
```http
GET /api/admin/logs
```
**Auth**: Required (JWT - Admin role)

**Query Params**:
- `userId` (optional)
- `action` (optional)
- `entity` (optional)
- `startDate` (optional)
- `endDate` (optional)
- `page` (default: 0)
- `size` (default: 10)

**Response** (200 OK):
```json
{
  "content": [
    {
      "logId": "long",
      "user": { /* User summary */ },
      "action": "string",
      "entity": "string",
      "entityId": "string",
      "timestamp": "timestamp"
    }
  ],
  "totalElements": "long",
  "totalPages": "integer"
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

Include JWT token in Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Notes

1. All timestamps in ISO 8601 format
2. All monetary values are in INR (₹) as `BigDecimal`
3. Distance in kilometers as `BigDecimal`
4. Weight in kilograms as `BigDecimal`
5. Phone numbers include country code
6. Pagination starts from page 0
7. Default page size is 10

---

**Document Version**: 2.0 (Entity-Aligned)  
**Last Updated**: January 25, 2026  
**Total APIs**: 45  
**Based on**: Actual Backend Entity Schema
