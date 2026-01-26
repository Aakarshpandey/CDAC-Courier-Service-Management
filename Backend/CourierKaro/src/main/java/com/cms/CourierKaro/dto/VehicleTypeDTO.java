package com.cms.CourierKaro.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class VehicleTypeDTO {
    private Long id;
    private String typeName;
    private BigDecimal baseFare;
    private BigDecimal perKmRate;
    private BigDecimal maxWeightKg;
}
