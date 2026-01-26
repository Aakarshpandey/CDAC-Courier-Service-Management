package com.cms.CourierKaro.dto;

import java.math.BigDecimal;
import com.cms.CourierKaro.entity.PaymentMethod;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentCreateDTO {
    private Long shipmentId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
}