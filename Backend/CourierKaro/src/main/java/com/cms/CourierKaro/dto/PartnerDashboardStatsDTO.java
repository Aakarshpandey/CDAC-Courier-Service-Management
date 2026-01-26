package com.cms.CourierKaro.dto;

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
public class PartnerDashboardStatsDTO {
	private Integer todayOrders;
	private Double todayEarnings;
	private Double totalEarnings;
	private Integer completedDeliveries;
	private Double avgRating;
	private Double totalDistanceKm; // Only if partner has orders
	private String message;
	private String status;
}
