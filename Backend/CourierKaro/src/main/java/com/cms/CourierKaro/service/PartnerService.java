package com.cms.CourierKaro.service;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.domain.Pageable;

import com.cms.CourierKaro.dto.PartnerApplicationDTO;
import com.cms.CourierKaro.dto.AvailableOrderDTO;
import com.cms.CourierKaro.dto.PartnerDashboardStatsDTO;
import com.cms.CourierKaro.dto.PartnerEarningsHistoryDTO;
import com.cms.CourierKaro.dto.PartnerOnlineStatusResponseDTO;
import com.cms.CourierKaro.dto.PartnerOnlineStatusUpdateDTO;
import com.cms.CourierKaro.dto.PartnerProfileResponseDTO;
import com.cms.CourierKaro.dto.PartnerProfileUpdateDTO;
import com.cms.CourierKaro.dto.PartnerPayoutDTO;
import com.cms.CourierKaro.dto.PartnerRegisterDTO;
import com.cms.CourierKaro.dto.PartnerEarningsDTO;
import com.cms.CourierKaro.dto.ProfilePhotoResponseDTO;
import com.cms.CourierKaro.dto.TransferEarningsRequestDTO;
import com.cms.CourierKaro.response.PartnerResp;

public interface PartnerService {
	PartnerResp registerPartner(PartnerRegisterDTO dto);

	PartnerProfileResponseDTO getPartnerProfile(String userEmail);

	PartnerDashboardStatsDTO getPartnerDashboardStats(String userEmail);

	PartnerOnlineStatusResponseDTO updateOnlineStatus(String userEmail, PartnerOnlineStatusUpdateDTO dto);

	PartnerProfileResponseDTO updatePartnerProfile(String userEmail, PartnerProfileUpdateDTO dto);

	ProfilePhotoResponseDTO uploadPartnerProfilePhoto(String userEmail,
			org.springframework.web.multipart.MultipartFile file);

	/**
	 * Get all pending partner applications (not yet approved)
	 * 
	 * @return List of partner applications where isApproved = false
	 */
	List<PartnerApplicationDTO> getPendingPartners();

	/**
	 * Approve a partner application
	 * 
	 * @param partnerId The ID of the partner to approve
	 * @return Response indicating success or failure
	 */
	PartnerResp approvePartner(Long partnerId);

	/**
	 * Reject a partner application
	 * 
	 * @param partnerId The ID of the partner to reject
	 * @return Response indicating success or failure
	 */
	PartnerResp rejectPartner(Long partnerId);
	
	PartnerEarningsHistoryDTO getEarningsHistory(String userEmail, Timestamp startDate, Timestamp endDate, Pageable pageable);

	ProfilePhotoResponseDTO removePartnerProfilePhoto(String userEmail);

	List<AvailableOrderDTO> getAvailableOrders(String userEmail);

	List<PartnerPayoutDTO> getPartnerPayouts(String userEmail);

	PartnerPayoutDTO transferEarnings(String userEmail, TransferEarningsRequestDTO dto);

	PartnerEarningsDTO getPartnerEarnings(String userEmail, String period);
}
