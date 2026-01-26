package com.cms.CourierKaro.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.CourierKaro.entity.Partner;
import com.cms.CourierKaro.entity.User;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
	Optional<Partner> findByUserId(User user);
}

