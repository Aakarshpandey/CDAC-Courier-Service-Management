package com.cms.CourierKaro.service;
import com.cms.CourierKaro.dto.PaymentCreateDTO;
import com.cms.CourierKaro.dto.PaymentInitiateResponseDTO;
import com.cms.CourierKaro.dto.PaymentResponseDTO;
public interface PaymentService {
    PaymentInitiateResponseDTO createPayment(PaymentCreateDTO paymentCreateDTO);
    PaymentResponseDTO getPaymentById(Long paymentId);
}