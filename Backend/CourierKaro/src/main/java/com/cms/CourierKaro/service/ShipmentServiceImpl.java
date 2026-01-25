package com.cms.CourierKaro.service;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Service;

import com.cms.CourierKaro.dto.ShipmentRequestDTO;
import com.cms.CourierKaro.dto.ShipmentResponseDTO;
import com.cms.CourierKaro.entity.Location;
import com.cms.CourierKaro.entity.PackageType;
import com.cms.CourierKaro.entity.PaymentStatus;
import com.cms.CourierKaro.entity.Shipment;
import com.cms.CourierKaro.entity.Status;
import com.cms.CourierKaro.entity.User;
import com.cms.CourierKaro.entity.VehicleType;
import com.cms.CourierKaro.repository.LocationRepository;
import com.cms.CourierKaro.repository.ShipmentRepository;
import com.cms.CourierKaro.repository.UserRepository;
import com.cms.CourierKaro.repository.VehicleTypeRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    private final LocationRepository locationRepository;

    @Override
    public ShipmentResponseDTO createShipment(ShipmentRequestDTO request, String userEmail) {
        // Get the user
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));

        // Get or create vehicle type
        VehicleType vehicleType = getOrCreateVehicleType(request.getVehicleType());

        // Create pickup location
        Location pickupLocation = new Location();
        pickupLocation.setPincode(request.getPickupLocation().getPincode());
        pickupLocation = locationRepository.save(pickupLocation);

        // Create delivery location
        Location deliveryLocation = new Location();
        deliveryLocation.setPincode(request.getDeliveryLocation().getPincode());
        deliveryLocation = locationRepository.save(deliveryLocation);

        // Calculate distance based on pincodes (simplified calculation)
        BigDecimal distance = calculateDistance(
                request.getPickupLocation().getPincode(),
                request.getDeliveryLocation().getPincode()
        );

        // Calculate price: baseFare + (perKmRate * distance)
        BigDecimal baseFare = BigDecimal.valueOf(vehicleType.getBaseFare());
        BigDecimal perKmRate = BigDecimal.valueOf(vehicleType.getPerKmRate());
        BigDecimal calculatedPrice = baseFare.add(perKmRate.multiply(distance));

        // Create shipment
        Shipment shipment = new Shipment();
        shipment.setCustormerId(customer);
        shipment.setVehicleTypeId(vehicleType);
        shipment.setPickupLocationId(pickupLocation);
        shipment.setDeliveryLocationId(deliveryLocation);

        // Set package details
        shipment.setPackageType(parsePackageType(request.getPackageType()));
        shipment.setWeightKg(BigDecimal.valueOf(request.getWeight()));

        // Set pickup details
        shipment.setPickupAddress(request.getPickupLocation().getFullAddress());
        shipment.setPickupContactName(request.getPickupLocation().getContactName());
        shipment.setPickupPhone(request.getPickupLocation().getPhoneNo());

        // Set delivery details
        shipment.setDeliveryAddress(request.getDeliveryLocation().getFullAddress());
        shipment.setDeliveryContactName(request.getDeliveryLocation().getContactName());
        shipment.setDeliveryPhone(request.getDeliveryLocation().getPhoneNo());

        // Set pricing
        shipment.setDistanceKm(distance);
        shipment.setCalculatedPrice(calculatedPrice);

        // Set status
        shipment.setStatus(Status.PENDING);
        shipment.setPaymentStatus(PaymentStatus.PENDING);

        // Save shipment
        shipment = shipmentRepository.save(shipment);

        // Build response
        return ShipmentResponseDTO.builder()
                .shipmentId(shipment.getShipmentId())
                .status("SUCCESS")
                .message("Shipment created successfully")
                .pickupAddress(shipment.getPickupAddress())
                .pickupContactName(shipment.getPickupContactName())
                .pickupPhone(shipment.getPickupPhone())
                .pickupPincode(request.getPickupLocation().getPincode())
                .deliveryAddress(shipment.getDeliveryAddress())
                .deliveryContactName(shipment.getDeliveryContactName())
                .deliveryPhone(shipment.getDeliveryPhone())
                .deliveryPincode(request.getDeliveryLocation().getPincode())
                .packageType(shipment.getPackageType().name())
                .weight(shipment.getWeightKg())
                .vehicleType(vehicleType.getTypeName())
                .baseFare(baseFare)
                .perKmRate(perKmRate)
                .distanceKm(distance)
                .calculatedPrice(calculatedPrice)
                .createdAt(shipment.getCreatedAt())
                .build();
    }

    private VehicleType getOrCreateVehicleType(String vehicleTypeName) {
        return vehicleTypeRepository.findByTypeNameIgnoreCase(vehicleTypeName)
                .orElseGet(() -> createVehicleType(vehicleTypeName));
    }

    private VehicleType createVehicleType(String typeName) {
        VehicleType vehicleType = new VehicleType();
        vehicleType.setTypeName(typeName.toLowerCase());

        switch (typeName.toLowerCase()) {
            case "bike":
                vehicleType.setBaseFare(50.0);
                vehicleType.setPerKmRate(5.0);
                vehicleType.setMaxWeigthKg(10.0);
                break;
            case "car":
                vehicleType.setBaseFare(150.0);
                vehicleType.setPerKmRate(10.0);
                vehicleType.setMaxWeigthKg(50.0);
                break;
            case "small truck":
            case "small_truck":
            case "smalltruck":
                vehicleType.setTypeName("small truck");
                vehicleType.setBaseFare(300.0);
                vehicleType.setPerKmRate(15.0);
                vehicleType.setMaxWeigthKg(500.0);
                break;
            case "large truck":
            case "large_truck":
            case "largetruck":
                vehicleType.setTypeName("large truck");
                vehicleType.setBaseFare(600.0);
                vehicleType.setPerKmRate(20.0);
                vehicleType.setMaxWeigthKg(2000.0);
                break;
            default:
                throw new RuntimeException("Invalid vehicle type: " + typeName +
                        ". Valid types are: bike, car, small truck, large truck");
        }

        return vehicleTypeRepository.save(vehicleType);
    }

    private BigDecimal calculateDistance(String pickupPincode, String deliveryPincode) {
        // Simplified distance calculation based on pincode difference
        // In production, use a geocoding API like Google Maps
        try {
            int pickup = Integer.parseInt(pickupPincode);
            int delivery = Integer.parseInt(deliveryPincode);
            int diff = Math.abs(pickup - delivery);

            // Approximate distance based on pincode difference
            // Each pincode unit difference roughly equals 0.5-2 km in urban areas
            double distance = (diff * 0.1) + 5; // Minimum 5 km + variation

            return BigDecimal.valueOf(distance).setScale(2, RoundingMode.HALF_UP);
        } catch (NumberFormatException e) {
            // Default distance if pincodes can't be parsed
            return BigDecimal.valueOf(10.0);
        }
    }

    private PackageType parsePackageType(String packageType) {
        if (packageType == null || packageType.isEmpty()) {
            return PackageType.OTHER;
        }
        try {
            return PackageType.valueOf(packageType.toUpperCase());
        } catch (IllegalArgumentException e) {
            return PackageType.OTHER;
        }
    }
}
