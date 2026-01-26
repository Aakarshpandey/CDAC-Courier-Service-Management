package com.cms.CourierKaro.service;

import com.cms.CourierKaro.dto.VehicleTypeDTO;
import com.cms.CourierKaro.entity.VehicleType;
import com.cms.CourierKaro.repository.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleTypeServiceImpl implements VehicleTypeService {

    private final VehicleTypeRepository vehicleTypeRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<VehicleTypeDTO> getAllVehicleTypes() {
        List<VehicleType> vehicleTypes = vehicleTypeRepository.findAll();
        return vehicleTypes.stream()
                .map(vehicleType -> modelMapper.map(vehicleType, VehicleTypeDTO.class))
                .collect(Collectors.toList());
    }
}
