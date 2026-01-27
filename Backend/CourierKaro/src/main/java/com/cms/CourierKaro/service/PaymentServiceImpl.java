package com.cms.CourierKaro.service;

import java.time.LocalDateTime;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cms.CourierKaro.dto.PaymentCreateDTO;
import com.cms.CourierKaro.dto.PaymentInitiateResponseDTO;
import com.cms.CourierKaro.entity.Payment;
import com.cms.CourierKaro.entity.PaymentStatus;
import com.cms.CourierKaro.entity.Shipment;
import com.cms.CourierKaro.repository.PaymentRepository;
import com.cms.CourierKaro.repository.ShipmentRepository;
import com.cms.CourierKaro.dto.PaymentResponseDTO;
import com.cms.CourierKaro.dto.PaymentWebhookDTO;
import java.util.Optional;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Override
    public PaymentInitiateResponseDTO createPayment(PaymentCreateDTO paymentCreateDTO) {
        Shipment shipment = shipmentRepository.findById(paymentCreateDTO.getShipmentId())
                .orElseThrow(() -> new RuntimeException("Shipment not found with id: " + paymentCreateDTO.getShipmentId()));

        Payment payment = new Payment();
        payment.setShipmentId(shipment);
        payment.setAmount(paymentCreateDTO.getAmount());
        payment.setPaymentMethod(paymentCreateDTO.getPaymentMethod());
        payment.setStatus(PaymentStatus.PENDING);
        
        // Simulate a transaction gateway ID
        String transactionId = UUID.randomUUID().toString();
        payment.setTransactionGatewayId(transactionId);
        
        // Set timestamp
        payment.setCreatedAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        // Update Shipment Payment Status
        shipment.setPaymentStatus(PaymentStatus.PENDING);
        shipmentRepository.save(shipment);

        return new PaymentInitiateResponseDTO(
                "SUCCESS",
                savedPayment.getPaymentId(),
                savedPayment.getTransactionGatewayId(),
                savedPayment.getStatus()
        );
    }
    
    @Override
    public PaymentResponseDTO getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.setPaymentId(payment.getPaymentId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethod(payment.getPaymentMethod().name());
        dto.setTransactionGatewayId(payment.getTransactionGatewayId());
        dto.setStatus(payment.getStatus().name());
        dto.setCreatedAt(payment.getCreatedAt());
        Shipment shipment = payment.getShipmentId();
        PaymentResponseDTO.ShipmentSummary shipmentSummary = new PaymentResponseDTO.ShipmentSummary(
                shipment.getShipmentId(),
                shipment.getStatus().name(),
                shipment.getPackageType().name()
        );
        dto.setShipment(shipmentSummary);
        return dto;
    }
    
    @Override
    public void processWebhook(PaymentWebhookDTO webhookDto) {
        Payment payment = paymentRepository.findByTransactionGatewayId(webhookDto.getTransactionGatewayId())
                .orElseThrow(() -> new RuntimeException("Payment not found with gateway ID: " + webhookDto.getTransactionGatewayId()));
        PaymentStatus newStatus = PaymentStatus.valueOf(webhookDto.getStatus().toUpperCase());
        payment.setStatus(newStatus);
        paymentRepository.save(payment);
        // Update Shipment Payment Status as well
        Shipment shipment = payment.getShipmentId();
        shipment.setPaymentStatus(newStatus);
        shipmentRepository.save(shipment);
    }
}