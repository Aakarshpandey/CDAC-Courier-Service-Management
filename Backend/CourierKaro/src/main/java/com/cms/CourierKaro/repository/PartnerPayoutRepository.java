package com.cms.CourierKaro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cms.CourierKaro.entity.Partner;
import com.cms.CourierKaro.entity.PartnerPayout;

public interface PartnerPayoutRepository extends JpaRepository<PartnerPayout, Long> {
	List<PartnerPayout> findByPartner(Partner partner);
	List<PartnerPayout> findByPartnerOrderByPaidAtDesc(Partner partner);
}
