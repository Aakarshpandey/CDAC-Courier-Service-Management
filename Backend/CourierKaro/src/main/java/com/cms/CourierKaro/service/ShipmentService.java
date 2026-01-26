package com.cms.CourierKaro.service;

import java.util.List;

import com.cms.CourierKaro.dto.ShipmentRequestDTO;
import com.cms.CourierKaro.dto.RecentOrdersDTO;
import com.cms.CourierKaro.dto.ShipmentResponseDTO;

public interface ShipmentService {
    ShipmentResponseDTO createShipment(ShipmentRequestDTO request, String userEmail);
    List<ShipmentResponseDTO> getUserShipments(String userEmail);
    ShipmentResponseDTO getShipmentById(Long shipmentId);
	List<RecentOrdersDTO> getShipments(String userEmail);
    ShipmentResponseDTO cancelShipment(Long shipmentId);
}
