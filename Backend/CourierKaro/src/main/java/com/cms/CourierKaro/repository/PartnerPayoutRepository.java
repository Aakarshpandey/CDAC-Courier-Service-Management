package com.cms.CourierKaro.repository;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cms.CourierKaro.dto.DailyEarningDTO;
import com.cms.CourierKaro.entity.Partner;
import com.cms.CourierKaro.entity.PartnerPayout;

public interface PartnerPayoutRepository extends JpaRepository<PartnerPayout, Long> {
    
    // Group earnings by date (casting timestamp to date)
    @Query("SELECT new com.cms.CourierKaro.dto.DailyEarningDTO(DATE(p.paidAt), COUNT(p), SUM(p.amount)) " +
           "FROM PartnerPayout p " +
           "WHERE p.partner = :partner " +
           "AND (:startDate IS NULL OR p.paidAt >= :startDate) " +
           "AND (:endDate IS NULL OR p.paidAt <= :endDate) " +
           "GROUP BY DATE(p.paidAt) " +
           "ORDER BY DATE(p.paidAt) DESC")
    Page<DailyEarningDTO> findEarningsHistory(
        @Param("partner") Partner partner, 
        @Param("startDate") Timestamp startDate, 
        @Param("endDate") Timestamp endDate, 
        Pageable pageable
    );

    @Query("SELECT SUM(p.amount) FROM PartnerPayout p WHERE p.partner = :partner")
    Double calculateTotalEarnings(@Param("partner") Partner partner);

	List<PartnerPayout> findByPartner(Partner partner);
	List<PartnerPayout> findByPartnerOrderByPaidAtDesc(Partner partner);
}
