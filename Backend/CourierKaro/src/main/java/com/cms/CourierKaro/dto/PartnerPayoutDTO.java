package com.cms.CourierKaro.dto;

import java.sql.Timestamp;

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
public class PartnerPayoutDTO {
	private Long payoutId;
	private Long shipmentId;
	private Double amount;
	private String paymentStatus;
	private Timestamp paidAt;
	private String message;
	private String status;
}
