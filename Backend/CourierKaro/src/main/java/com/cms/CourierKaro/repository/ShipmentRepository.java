package com.cms.CourierKaro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cms.CourierKaro.dto.AllOrdersDTO;
import com.cms.CourierKaro.dto.RecentOrdersDTO;
import org.springframework.data.repository.query.Param;

import com.cms.CourierKaro.dto.ShipmentResponseDTO;
import com.cms.CourierKaro.entity.Shipment;
import com.cms.CourierKaro.entity.Status;
import com.cms.CourierKaro.entity.User;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByCustormerId(User customer);
    List<Shipment> findByCustormerIdOrderByCreatedAtDesc(User customer);
    List<Shipment> findByPartnerId(com.cms.CourierKaro.entity.Partner partner);
    
    // Original method without JOIN FETCH (causes N+1 problem)
    List<Shipment> findAllByOrderByCreatedAtDesc();
    
    // Optimized query with JOIN FETCH to load all related entities in one query
    @Query("SELECT DISTINCT s FROM Shipment s " +
           "LEFT JOIN FETCH s.custormerId " +
           "LEFT JOIN FETCH s.partnerId p " +
           "LEFT JOIN FETCH p.userId " +
           "LEFT JOIN FETCH s.vehicleTypeId " +
           "LEFT JOIN FETCH s.pickupLocationId " +
           "LEFT JOIN FETCH s.deliveryLocationId " +
           "ORDER BY s.createdAt DESC")
    List<Shipment> findAllWithDetailsOrderByCreatedAtDesc();
    
    // Recent Orders: Direct DTO projection query (limited to 10 most recent)
    @Query(value = "SELECT new com.cms.CourierKaro.dto.RecentOrdersDTO(" +
           "s.shipmentId, " +
           "c.firstName, " +
           "c.lastName, " +
           "s.status, " +
           "s.calculatedPrice, " +
           "s.createdAt) " +
           "FROM Shipment s " +
           "JOIN s.custormerId c " +
           "ORDER BY s.createdAt DESC")
    List<RecentOrdersDTO> findRecentOrdersDTO();
    
    // All Orders: Direct DTO projection query (complete list with partner info)
    @Query("SELECT new com.cms.CourierKaro.dto.AllOrdersDTO(" +
           "s.shipmentId, " +
           "c.firstName, " +
           "c.lastName, " +
           "s.pickupAddress, " +
           "s.deliveryAddress, " +
           "COALESCE(pu.firstName, 'Unassigned'), " +
           "COALESCE(pu.lastName, ''), " +
           "CAST(s.status AS string), " +
           "s.calculatedPrice) " +
           "FROM Shipment s " +
           "JOIN s.custormerId c " +
           "LEFT JOIN s.partnerId p " +
           "LEFT JOIN p.userId pu " +
           "ORDER BY s.createdAt DESC")
    List<AllOrdersDTO> findAllOrdersDTO();
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
     
     long countByStatus(Status status);
}
