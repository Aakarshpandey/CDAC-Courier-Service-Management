package com.cms.CourierKaro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cms.CourierKaro.dto.AllOrdersDTO;
import com.cms.CourierKaro.dto.RecentOrdersDTO;
import com.cms.CourierKaro.entity.Shipment;
import com.cms.CourierKaro.entity.User;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByCustormerId(User customer);
    List<Shipment> findByCustormerIdOrderByCreatedAtDesc(User customer);
    
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
}
