package com.cms.CourierKaro.dto;
import java.math.BigDecimal;
import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class PricingResponseDTO {
    private BigDecimal baseFare;
    private BigDecimal distanceCharge;
    private BigDecimal totalPrice;
    private Double distanceKm;
    private String vehicleType;
}