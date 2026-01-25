package com.cms.CourierKaro.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
}
