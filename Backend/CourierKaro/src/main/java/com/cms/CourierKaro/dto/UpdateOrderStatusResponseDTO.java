package com.cms.CourierKaro.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusResponseDTO {
    private Long shipmentId;
    private String status;
    private String message;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
}
