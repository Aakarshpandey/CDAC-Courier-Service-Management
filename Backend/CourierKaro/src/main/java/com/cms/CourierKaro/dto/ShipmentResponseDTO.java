package com.cms.CourierKaro.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.cms.CourierKaro.entity.PackageType;
import com.cms.CourierKaro.entity.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentResponseDTO {
    private Long shipmentId;
    private String status;
    private String message;

    private String pickupAddress;
    private String pickupContactName;
    private String pickupPhone;
    private String pickupPincode;

    private String deliveryAddress;
    private String deliveryContactName;
    private String deliveryPhone;
    private String deliveryPincode;

    private String packageType;
    private BigDecimal weight;
    private String vehicleType;

    private BigDecimal baseFare;
    private BigDecimal perKmRate;
    private BigDecimal distanceKm;
    private BigDecimal calculatedPrice;

    private LocalDateTime createdAt;
    
    public ShipmentResponseDTO(
            Long shipmentId,
            Status status,
            String pickupAddress,
            String pickupContactName,
            String pickupPhone,
            String pickupPincode,
            String deliveryAddress,
            String deliveryContactName,
            String deliveryPhone,
            String deliveryPincode,
            PackageType packageType,
            BigDecimal weight,
            String vehicleType,
            BigDecimal baseFare,
            BigDecimal perKmRate,
            BigDecimal distanceKm,
            BigDecimal calculatedPrice,
            LocalDateTime createdAt
    ) {
        this.shipmentId = shipmentId;
        this.status = status != null ? status.name() : "PENDING";
        this.message = "Shipment retrieved successfully";
        this.pickupAddress = pickupAddress;
        this.pickupContactName = pickupContactName;
        this.pickupPhone = pickupPhone;
        this.pickupPincode = pickupPincode;
        this.deliveryAddress = deliveryAddress;
        this.deliveryContactName = deliveryContactName;
        this.deliveryPhone = deliveryPhone;
        this.deliveryPincode = deliveryPincode;
        this.packageType = packageType != null ? packageType.name() : null;
        this.weight = weight;
        this.vehicleType = vehicleType;
        this.baseFare = baseFare;
        this.perKmRate = perKmRate;
        this.distanceKm = distanceKm;
        this.calculatedPrice = calculatedPrice;
        this.createdAt = createdAt;
    }
}
