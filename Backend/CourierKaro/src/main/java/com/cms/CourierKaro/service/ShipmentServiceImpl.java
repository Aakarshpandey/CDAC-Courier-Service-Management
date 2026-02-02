package com.cms.CourierKaro.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.cms.CourierKaro.dto.AllOrdersDTO;
import com.cms.CourierKaro.dto.RecentOrdersDTO;
import com.cms.CourierKaro.dto.ShipmentRequestDTO;
import com.cms.CourierKaro.dto.ShipmentResponseDTO;
import com.cms.CourierKaro.entity.Location;
import com.cms.CourierKaro.entity.PackageType;
import com.cms.CourierKaro.entity.PaymentStatus;
import com.cms.CourierKaro.entity.Shipment;
import com.cms.CourierKaro.entity.Status;
import com.cms.CourierKaro.entity.User;
import com.cms.CourierKaro.entity.VehicleType;
import com.cms.CourierKaro.exception.ResourceNotFoundException;
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
    
    private final ModelMapper mapper;

    @Override
    public ShipmentResponseDTO createShipment(ShipmentRequestDTO request, String userEmail) {
        // Get the user
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        
        // Get vehicle type
        VehicleType vehicleType =vehicleTypeRepository.findByTypeNameIgnoreCase(request.getVehicleType());

        // Create pickup and delivery location
        Location pickupLocation = locationRepository.save(mapper.map(request.getPickupLocation(), Location.class));
        Location deliveryLocation = locationRepository.save(mapper.map(request.getDeliveryLocation(), Location.class));

    

        // Create shipment
        Shipment shipment = new Shipment();
//        Shipment shipment2 =mapper.map(request, Shipment.class);
//        System.out.println(shipment);
//        System.out.println(shipment2);
        
        //4 associations
        shipment.setCustormerId(customer);
        shipment.setVehicleTypeId(vehicleType);
        shipment.setPickupLocationId(pickupLocation);
        shipment.setDeliveryLocationId(deliveryLocation);

        // Set package details
        shipment.setPackageType(PackageType.valueOf(request.getPackageType().toUpperCase()));
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
        shipment.setDistanceKm(request.getDistanceKm());
        shipment.setCalculatedPrice(request.getCalculatedPrice());

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
                .baseFare(vehicleType.getBaseFare())
                .perKmRate(vehicleType.getPerKmRate())
                .distanceKm(request.getDistanceKm())
                .calculatedPrice(request.getCalculatedPrice())
                .createdAt(shipment.getCreatedAt())
                .build();
    }

  
  

    



	@Override
	public List<RecentOrdersDTO> getShipments(String userEmail) {
		// Recent orders: Direct DTO projection - returns limited recent orders
		return shipmentRepository.findRecentOrdersDTO();
	}

	@Override
	public List<AllOrdersDTO> getAllOrders(String userEmail) {
		// All orders: Direct DTO projection - returns complete order list with partner info
		return shipmentRepository.findAllOrdersDTO();
	}

	@Override
    public List<ShipmentResponseDTO> getUserShipments(String userEmail) {
        List<ShipmentResponseDTO> shipments = shipmentRepository.findShipmentsByEmail(userEmail);

        if (shipments.isEmpty()) {
            userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        }

        return shipments;
    }

    @Override
    public ShipmentResponseDTO getShipmentById(Long shipmentId) {
        return shipmentRepository.findShipmentDTOById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + shipmentId));
    }
    
    @Override
    public ShipmentResponseDTO cancelShipment(Long shipmentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with id: " + shipmentId));

        if (shipment.getStatus() != Status.PENDING) {
            throw new ResourceNotFoundException("Only pending orders can be cancelled");
        }

        shipment.setStatus(Status.CANCELLED);
        shipmentRepository.save(shipment);

        return ShipmentResponseDTO.builder()
                .shipmentId(shipmentId)
                .status("SUCCESS")
                .message("Order cancelled successfully")
                .build();
    }

}
