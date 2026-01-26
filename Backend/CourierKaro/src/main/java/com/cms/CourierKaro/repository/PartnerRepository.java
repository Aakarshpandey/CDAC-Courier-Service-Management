package com.cms.CourierKaro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cms.CourierKaro.entity.Partner;
import com.cms.CourierKaro.entity.PartnerStatus;
import com.cms.CourierKaro.entity.User;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
	Optional<Partner> findByUserId(User user);
	
	/**
	 * Find all partners by status with eager fetching of userId and vehicleTypeId
	 * to avoid N+1 problem. Uses JOIN FETCH to load related entities in a single query.
	 * 
	 * @param status The partner status to filter by
	 * @return List of partners with the specified status
	 */
	@Query("SELECT p FROM Partner p " +
	       "JOIN FETCH p.userId " +
	       "JOIN FETCH p.vehicleTypeId " +
	       "WHERE p.status = :status")
	List<Partner> findByStatusWithDetails(@Param("status") PartnerStatus status);
}


