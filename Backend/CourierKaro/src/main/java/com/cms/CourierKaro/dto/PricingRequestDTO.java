package com.cms.CourierKaro.dto;
import java.math.BigDecimal;
import lombok.Data;
@Data
public class PricingRequestDTO {
    private Long pickupLocationId;
    private Long deliveryLocationId;
    private Long vehicleTypeId;
    private BigDecimal weightKg;
}