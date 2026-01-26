package com.cms.CourierKaro.dto;

import com.cms.CourierKaro.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PaymentInitiateResponseDTO {
    private String status;
    private Long paymentId;
    private String transactionGatewayId;
    private PaymentStatus paymentStatus;
}