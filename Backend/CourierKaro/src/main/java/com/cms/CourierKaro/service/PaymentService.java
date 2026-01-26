package com.cms.CourierKaro.service;
import com.cms.CourierKaro.dto.PaymentCreateDTO;
import com.cms.CourierKaro.dto.PaymentInitiateResponseDTO;
import com.cms.CourierKaro.dto.PaymentResponseDTO;
import com.cms.CourierKaro.dto.PaymentWebhookDTO;
public interface PaymentService {
    PaymentInitiateResponseDTO createPayment(PaymentCreateDTO paymentCreateDTO);
    PaymentResponseDTO getPaymentById(Long paymentId);
    void processWebhook(PaymentWebhookDTO webhookDto);
}