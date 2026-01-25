package com.cms.CourierKaro.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.CourierKaro.entity.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByPincode(String pincode);
}
