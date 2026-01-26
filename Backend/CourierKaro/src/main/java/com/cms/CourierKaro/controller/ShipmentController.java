package com.cms.CourierKaro.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cms.CourierKaro.dto.AllOrdersDTO;
import com.cms.CourierKaro.dto.RecentOrdersDTO;
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

    @GetMapping("/recentOrders")
    public ResponseEntity<?> getRecentOrders(Principal principal) {
        String userEmail = principal.getName();
        List<RecentOrdersDTO> recentOrders = shipmentService.getShipments(userEmail);
        return ResponseEntity.ok(recentOrders);
    }
    
    @GetMapping("/allOrders")
    public ResponseEntity<?> getAllOrders(Principal principal) {
        String userEmail = principal.getName();
        List<AllOrdersDTO> allOrders = shipmentService.getAllOrders(userEmail);
        return ResponseEntity.ok(allOrders);
    }
    @GetMapping("/user")
    public ResponseEntity<?> getUserShipments(@RequestParam String email, Principal principal) {
            // Use principal if authenticated, otherwise use email from query param
//            String userEmail = principal.getName();
             
            String userEmail = email;          
            List<ShipmentResponseDTO> shipments = shipmentService.getUserShipments(userEmail);
            return ResponseEntity.ok(shipments);
     
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getShipmentById(@PathVariable Long id) {
    	ShipmentResponseDTO shipment = shipmentService.getShipmentById(id);
    	return ResponseEntity.ok(shipment);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> cancelShipment(@PathVariable Long id) {
            ShipmentResponseDTO response = shipmentService.cancelShipment(id);
            return ResponseEntity.ok(response);
    }
}

