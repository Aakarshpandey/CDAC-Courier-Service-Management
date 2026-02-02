package com.cms.CourierKaro.repository;
import com.cms.CourierKaro.entity.Rating;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByPartnerId_PartnerId(Long partnerId);
    Page<Rating> findByPartnerId_PartnerId(Long partnerId, Pageable pageable);
    long countByPartnerId_PartnerId(Long partnerId);
    Optional<Rating> findByShipmentId_ShipmentId(Long shipmentId);
}

