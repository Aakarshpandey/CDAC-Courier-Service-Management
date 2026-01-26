package com.cms.CourierKaro.service;

import com.cms.CourierKaro.dto.PaymentCreateDTO;
import com.cms.CourierKaro.dto.PaymentInitiateResponseDTO;

public interface PaymentService {
    PaymentInitiateResponseDTO createPayment(PaymentCreateDTO paymentCreateDTO);
}