package com.cms.CourierKaro.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AllOrdersDTO {
    private Long shipmentId;
    private String firstName;
    private String lastName;
    private String pickupAddress;
    private String deliveryAddress;
    private String partnerFirstName;
    private String partnerLastName;
    private String status;
    private BigDecimal amount;
    private BigDecimal calculatedPrice;
    private LocalDateTime createdAt;
    private boolean hasRating;
}
