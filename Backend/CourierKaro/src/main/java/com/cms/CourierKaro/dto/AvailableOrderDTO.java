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
public class AvailableOrderDTO {
	private Long shipmentId;
	private String pickupAddress;
	private String deliveryAddress;
	private String pickupPincode;
	private String deliveryPincode;
	private BigDecimal distanceKm;
	private BigDecimal calculatedPrice;
	private String packageType;
	private BigDecimal weightKg;
	private String vehicleTypeName;
	private LocalDateTime createdAt;
	private String customerName;
}
