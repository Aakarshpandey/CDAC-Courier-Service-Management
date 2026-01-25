package com.cms.CourierKaro.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.CourierKaro.entity.VehicleType;

public interface VehicleTypeRepository extends JpaRepository<VehicleType, Long> {
    Optional<VehicleType> findByTypeName(String typeName);
    Optional<VehicleType> findByTypeNameIgnoreCase(String typeName);
}
