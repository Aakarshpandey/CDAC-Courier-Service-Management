package com.cms.CourierKaro.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {
    private Long paymentId;
    private ShipmentSummary shipment;
    private BigDecimal amount;
    private String paymentMethod;
    private String transactionGatewayId;
    private String status;
    private LocalDateTime createdAt;
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShipmentSummary {
        private Long shipmentId;
        private String status;
        private String packageType;
    }
}