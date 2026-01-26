package com.cms.CourierKaro.dto;

import java.util.List;

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
public class PartnerEarningsDTO {
	private String period; // WEEK | MONTH
	private String fromDate; // yyyy-MM-dd
	private String toDate; // yyyy-MM-dd
	private Integer deliveries;
	private Double totalEarnings;
	private Double bonus;
	private List<PartnerEarningsBreakdownDTO> breakdown;
	private List<PartnerEarningsShipmentDTO> shipments;
	private String message;
	private String status;
}

