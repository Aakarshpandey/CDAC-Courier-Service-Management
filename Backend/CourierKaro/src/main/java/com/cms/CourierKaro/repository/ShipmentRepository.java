package com.cms.CourierKaro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.CourierKaro.entity.Shipment;
import com.cms.CourierKaro.entity.User;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByCustormerId(User customer);
    List<Shipment> findByCustormerIdOrderByCreatedAtDesc(User customer);
    List<Shipment> findAllByOrderByCreatedAtDesc();
}
