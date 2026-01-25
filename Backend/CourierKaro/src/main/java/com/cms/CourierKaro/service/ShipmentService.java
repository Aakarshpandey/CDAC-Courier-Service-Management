package com.cms.CourierKaro.service;

import java.util.List;

import com.cms.CourierKaro.dto.ShipmentRequestDTO;
import com.cms.CourierKaro.dto.AllOrdersDTO;
import com.cms.CourierKaro.dto.RecentOrdersDTO;
import com.cms.CourierKaro.dto.ShipmentResponseDTO;

public interface ShipmentService {
    ShipmentResponseDTO createShipment(ShipmentRequestDTO request, String userEmail);

	List<RecentOrdersDTO> getShipments(String userEmail);

	List<AllOrdersDTO> getAllOrders(String userEmail);
}
