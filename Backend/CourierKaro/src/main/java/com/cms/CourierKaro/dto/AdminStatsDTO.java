package com.cms.CourierKaro.dto;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
@Data
@Builder
public class AdminStatsDTO {
    private long totalUsers;
    private long totalPartners;
    private long activePartners;
    private long totalShipments;
    private long pendingShipments;
    private long inTransitShipments;
    private long completedShipments;
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
}