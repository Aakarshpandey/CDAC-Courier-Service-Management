package com.cms.CourierKaro.service;
import com.cms.CourierKaro.dto.AdminStatsDTO;
import com.cms.CourierKaro.dto.PartnerApprovalDTO;
import com.cms.CourierKaro.dto.UserProfileResponseDTO;
import com.cms.CourierKaro.entity.PartnerStatus;

import org.springframework.data.domain.Page;
import java.util.Map;
public interface AdminDashboardService {
    AdminStatsDTO getDashboardStats();
    Map<String, Object> getAllUsers(String search, int page, int size);   
    Map<String, Object> getAllPartners(PartnerStatus status, Boolean isApproved, int page, int size);
    void updatePartnerApproval(Long partnerId, PartnerApprovalDTO approvalDto);
}