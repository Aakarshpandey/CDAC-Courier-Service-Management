package com.cms.CourierKaro.service;

import com.cms.CourierKaro.dto.ShipmentRequestDTO;
import com.cms.CourierKaro.dto.ShipmentResponseDTO;

public interface ShipmentService {
    ShipmentResponseDTO createShipment(ShipmentRequestDTO request, String userEmail);
}
