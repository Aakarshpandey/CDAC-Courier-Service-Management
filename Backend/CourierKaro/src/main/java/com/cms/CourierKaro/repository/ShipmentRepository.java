package com.cms.CourierKaro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cms.CourierKaro.dto.ShipmentResponseDTO;
import com.cms.CourierKaro.entity.Shipment;
import com.cms.CourierKaro.entity.User;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByCustormerId(User customer);
    List<Shipment> findByCustormerIdOrderByCreatedAtDesc(User customer);
    List<Shipment> findAllByOrderByCreatedAtDesc();
    @Query("SELECT new com.cms.CourierKaro.dto.ShipmentResponseDTO(" +
            "s.shipmentId, " +
            "s.status, " +
            "s.pickupAddress, " +
            "s.pickupContactName, " +
            "s.pickupPhone, " +
            "p.pincode, " +
            "s.deliveryAddress, " +
            "s.deliveryContactName, " +
            "s.deliveryPhone, " +
            "d.pincode, " +
            "s.packageType, " +
            "s.weightKg, " +
            "v.typeName, " +
            "v.baseFare, " +
            "v.perKmRate, " +
            "s.distanceKm, " +
            "s.calculatedPrice, " +
            "s.createdAt) " +
            "FROM Shipment s " +
            "LEFT JOIN s.pickupLocationId p " +
            "LEFT JOIN s.deliveryLocationId d " +
            "LEFT JOIN s.vehicleTypeId v " +
            "WHERE s.custormerId.email = :email " +
            "ORDER BY s.createdAt DESC")
     List<ShipmentResponseDTO> findShipmentsByEmail(@Param("email") String email);

     // DTO Projection for single shipment by ID
     @Query("SELECT new com.cms.CourierKaro.dto.ShipmentResponseDTO(" +
            "s.shipmentId, " +
            "s.status, " +
            "s.pickupAddress, " +
            "s.pickupContactName, " +
            "s.pickupPhone, " +
            "p.pincode, " +
            "s.deliveryAddress, " +
            "s.deliveryContactName, " +
            "s.deliveryPhone, " +
            "d.pincode, " +
            "s.packageType, " +
            "s.weightKg, " +
            "v.typeName, " +
            "v.baseFare, " +
            "v.perKmRate, " +
            "s.distanceKm, " +
            "s.calculatedPrice, " +
            "s.createdAt) " +
            "FROM Shipment s " +
            "LEFT JOIN s.pickupLocationId p " +
            "LEFT JOIN s.deliveryLocationId d " +
            "LEFT JOIN s.vehicleTypeId v " +
            "WHERE s.shipmentId = :id")
     Optional<ShipmentResponseDTO> findShipmentDTOById(@Param("id") Long id);
}
