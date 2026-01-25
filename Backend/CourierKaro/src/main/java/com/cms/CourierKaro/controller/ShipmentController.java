package com.cms.CourierKaro.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.CourierKaro.dto.ShipmentRequestDTO;
import com.cms.CourierKaro.dto.ShipmentResponseDTO;
import com.cms.CourierKaro.service.ShipmentService;

import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping("/send")
    public ResponseEntity<?> sendPackage(@RequestBody ShipmentRequestDTO request, Principal principal) {
        try {
            // Use principal if authenticated, otherwise use email from request body
            String userEmail;
            if (principal != null) {
                userEmail = principal.getName();
            } else if (request.getUserEmail() != null && !request.getUserEmail().isEmpty()) {
                userEmail = request.getUserEmail();
            } else {
                return ResponseEntity.badRequest().body(
                        ShipmentResponseDTO.builder()
                                .status("ERROR")
                                .message("User email is required")
                                .build()
                );
            }
            ShipmentResponseDTO response = shipmentService.createShipment(request, userEmail);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    ShipmentResponseDTO.builder()
                            .status("ERROR")
                            .message(e.getMessage())
                            .build()
            );
        }
    }
}
