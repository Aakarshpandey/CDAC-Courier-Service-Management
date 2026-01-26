package com.cms.CourierKaro.service;

import com.cms.CourierKaro.dto.PartnerDashboardStatsDTO;
import com.cms.CourierKaro.dto.PartnerOnlineStatusResponseDTO;
import com.cms.CourierKaro.dto.PartnerOnlineStatusUpdateDTO;
import com.cms.CourierKaro.dto.PartnerProfileResponseDTO;
import com.cms.CourierKaro.dto.PartnerProfileUpdateDTO;
import com.cms.CourierKaro.dto.PartnerRegisterDTO;
import com.cms.CourierKaro.dto.ProfilePhotoResponseDTO;
import com.cms.CourierKaro.response.PartnerResp;

public interface PartnerService {
	PartnerResp registerPartner(PartnerRegisterDTO dto);
	PartnerProfileResponseDTO getPartnerProfile(String userEmail);
	PartnerDashboardStatsDTO getPartnerDashboardStats(String userEmail);
	PartnerOnlineStatusResponseDTO updateOnlineStatus(String userEmail, PartnerOnlineStatusUpdateDTO dto);
	PartnerProfileResponseDTO updatePartnerProfile(String userEmail, PartnerProfileUpdateDTO dto);
	ProfilePhotoResponseDTO uploadPartnerProfilePhoto(String userEmail, org.springframework.web.multipart.MultipartFile file);
}

