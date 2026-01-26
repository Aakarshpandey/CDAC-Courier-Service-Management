package com.cms.CourierKaro.service;

import java.util.List;

import com.cms.CourierKaro.dto.PartnerApplicationDTO;
import com.cms.CourierKaro.dto.PartnerDashboardStatsDTO;
import com.cms.CourierKaro.dto.PartnerOnlineStatusResponseDTO;
import com.cms.CourierKaro.dto.PartnerOnlineStatusUpdateDTO;
import com.cms.CourierKaro.dto.PartnerProfileResponseDTO;
import com.cms.CourierKaro.dto.PartnerRegisterDTO;
import com.cms.CourierKaro.response.PartnerResp;

public interface PartnerService {
	PartnerResp registerPartner(PartnerRegisterDTO dto);
	PartnerProfileResponseDTO getPartnerProfile(String userEmail);
	PartnerDashboardStatsDTO getPartnerDashboardStats(String userEmail);
	PartnerOnlineStatusResponseDTO updateOnlineStatus(String userEmail, PartnerOnlineStatusUpdateDTO dto);
	
	/**
	 * Get all suspended partner applications
	 * @return List of partner applications with SUSPENDED status
	 */
	List<PartnerApplicationDTO> getSuspendedPartners();
	
	/**
	 * Approve a partner application
	 * @param partnerId The ID of the partner to approve
	 * @return Response indicating success or failure
	 */
	PartnerResp approvePartner(Long partnerId);
	
	/**
	 * Reject a partner application
	 * @param partnerId The ID of the partner to reject
	 * @return Response indicating success or failure
	 */
	PartnerResp rejectPartner(Long partnerId);
}

