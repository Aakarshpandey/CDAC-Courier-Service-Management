package com.cms.CourierKaro.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.CourierKaro.dto.VehicleTypeDTO;
import com.cms.CourierKaro.service.VehicleTypeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vehicle-types")
@RequiredArgsConstructor
public class VehicleTypeController {

    private final VehicleTypeService vehicleTypeService;

    @GetMapping
    public ResponseEntity<Map<String, List<VehicleTypeDTO>>> getAllVehicleTypes() {
        List<VehicleTypeDTO> vehicleTypes = vehicleTypeService.getAllVehicleTypes();
        Map<String, List<VehicleTypeDTO>> response = new HashMap<>();
        response.put("vehicleTypes", vehicleTypes);
        return ResponseEntity.ok(response);
    }
}
