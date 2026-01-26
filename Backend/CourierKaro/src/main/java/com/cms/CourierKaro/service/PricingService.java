package com.cms.CourierKaro.service;
import com.cms.CourierKaro.dto.PricingRequestDTO;
import com.cms.CourierKaro.dto.PricingResponseDTO;
public interface PricingService {
    PricingResponseDTO calculatePrice(PricingRequestDTO request);
}