package com.cms.CourierKaro.controller;
import com.cms.CourierKaro.dto.PricingRequestDTO;
import com.cms.CourierKaro.dto.PricingResponseDTO;
import com.cms.CourierKaro.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/pricing")
@RequiredArgsConstructor
public class PricingController {
    private final PricingService pricingService;
    @PostMapping("/calculate")
    public ResponseEntity<PricingResponseDTO> calculatePrice(@RequestBody PricingRequestDTO request) {
        PricingResponseDTO response = pricingService.calculatePrice(request);
        return ResponseEntity.ok(response);
    }
}