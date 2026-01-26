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
public class AcceptedOrderDTO {
	private Long shipmentId;
	private String status;
	private String pickupAddress;
	private String pickupContactName;
	private String pickupPhone;
	private String pickupPincode;
	private String deliveryAddress;
	private String deliveryContactName;
	private String deliveryPhone;
	private String deliveryPincode;
	private String packageType;
	private BigDecimal weightKg;
	private String vehicleTypeName;
	private BigDecimal distanceKm;
	private BigDecimal calculatedPrice;
	private String customerName;
	private String customerPhone;
	private LocalDateTime createdAt;
	private String message;
}
