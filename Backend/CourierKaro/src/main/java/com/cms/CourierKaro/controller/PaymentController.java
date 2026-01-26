package com.cms.CourierKaro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.CourierKaro.dto.PaymentCreateDTO;
import com.cms.CourierKaro.dto.PaymentInitiateResponseDTO;
import com.cms.CourierKaro.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentInitiateResponseDTO> createPayment(@RequestBody PaymentCreateDTO paymentDto) {
        PaymentInitiateResponseDTO response = paymentService.createPayment(paymentDto);
        return ResponseEntity.ok(response);
    }
}