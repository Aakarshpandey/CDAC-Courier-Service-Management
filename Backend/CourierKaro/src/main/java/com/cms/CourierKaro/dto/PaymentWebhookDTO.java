package com.cms.CourierKaro.dto;
import lombok.Data;
import java.util.Map;
@Data
public class PaymentWebhookDTO {
    private String transactionGatewayId;
    private String status; // PAID | FAILED
    private Map<String, Object> metadata;
}