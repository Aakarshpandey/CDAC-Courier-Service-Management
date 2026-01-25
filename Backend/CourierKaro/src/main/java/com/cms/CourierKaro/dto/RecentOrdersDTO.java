package com.cms.CourierKaro.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.cms.CourierKaro.entity.Status;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecentOrdersDTO {
    private Long shipmentId;
    private String firstName;
    private String lastName;
    private Status status;
    private BigDecimal calculatedPrice;
    private LocalDateTime createdAt;
}
