package com.cms.CourierKaro.dto;

import java.math.BigDecimal;
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
public class PartnerEarningsHistoryDTO {
    private BigDecimal totalEarnings;
    private List<DailyEarningDTO> earnings;
}