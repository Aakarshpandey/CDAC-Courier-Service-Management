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
public class PartnerEarningsBreakdownDTO {
	private String label;
	private Integer deliveries;
	private Double earnings;
}

