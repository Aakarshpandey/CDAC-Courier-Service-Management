package com.cms.CourierKaro.dto;

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
public class PartnerEarningsShipmentDTO {
	private Long shipmentId;
	private LocalDateTime earnedAt;
	private Double amount;
	private String pickupAddress;
	private String deliveryAddress;
}

