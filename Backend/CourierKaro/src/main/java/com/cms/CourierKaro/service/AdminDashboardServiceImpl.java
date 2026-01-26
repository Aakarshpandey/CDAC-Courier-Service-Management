package com.cms.CourierKaro.service;
import com.cms.CourierKaro.dto.AdminStatsDTO;
import com.cms.CourierKaro.dto.PartnerProfileResponseDTO;
import com.cms.CourierKaro.entity.Partner;
import com.cms.CourierKaro.entity.PartnerStatus;
import com.cms.CourierKaro.entity.PaymentStatus;
import com.cms.CourierKaro.entity.Status;
import com.cms.CourierKaro.repository.PartnerRepository;
import com.cms.CourierKaro.repository.PaymentRepository;
import com.cms.CourierKaro.repository.ShipmentRepository;
import com.cms.CourierKaro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.cms.CourierKaro.dto.UserProfileResponseDTO;
import com.cms.CourierKaro.entity.User;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {
    private final UserRepository userRepository;
    private final PartnerRepository partnerRepository;
    private final ShipmentRepository shipmentRepository;
    private final PaymentRepository paymentRepository;
    private final ModelMapper modelMapper;
    @Override
    public AdminStatsDTO getDashboardStats() {
        LocalDateTime startOfToday = LocalDateTime.of(LocalDate.now(), LocalTime.MIDNIGHT);
        BigDecimal totalRevenue = paymentRepository.sumAmountByStatus(PaymentStatus.PAID);
        BigDecimal todayRevenue = paymentRepository.sumAmountByStatusAndCreatedAtAfter(PaymentStatus.PAID, startOfToday);
        return AdminStatsDTO.builder()
                .totalUsers(userRepository.count())
                .totalPartners(partnerRepository.count())
                .activePartners(partnerRepository.countByStatus(PartnerStatus.ACTIVE))
                .totalShipments(shipmentRepository.count())
                .pendingShipments(shipmentRepository.countByStatus(Status.PENDING))
                .inTransitShipments(shipmentRepository.countByStatus(Status.IN_TRANSIT))
                .completedShipments(shipmentRepository.countByStatus(Status.DELIVERED))
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .todayRevenue(todayRevenue != null ? todayRevenue : BigDecimal.ZERO)
                .build();
    }
    
    @Override
    public Map<String, Object> getAllUsers(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.searchUsers(search, pageable);
        List<UserProfileResponseDTO> userDTOs = userPage.getContent().stream()
                .map(user -> {
                    UserProfileResponseDTO dto = modelMapper.map(user, UserProfileResponseDTO.class);
                    return dto;
                })
                .collect(Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        response.put("content", userDTOs);
        response.put("totalElements", userPage.getTotalElements());
        response.put("totalPages", userPage.getTotalPages());
        response.put("currentPage", userPage.getNumber());
        return response;
    }
    
    @Override
    public java.util.Map<String, Object> getAllPartners(PartnerStatus status, Boolean isApproved, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Partner> partnerPage = partnerRepository.findAllPartners(status, isApproved, pageable);
        java.util.List<PartnerProfileResponseDTO> partnerDTOs = partnerPage.getContent().stream()
                .map(partner -> {
                    PartnerProfileResponseDTO dto = modelMapper.map(partner, PartnerProfileResponseDTO.class);
                    dto.setFirstName(partner.getUserId().getFirstName());
                    dto.setLastName(partner.getUserId().getLastName());
                    dto.setEmail(partner.getUserId().getEmail());
                    dto.setPhoneNumber(partner.getUserId().getPhoneNumber());
                    dto.setProfilePhotoUrl(partner.getUserId().getProfilePhotoUrl());
                    dto.setVehicleTypeName(partner.getVehicleTypeId().getTypeName());
                    dto.setResponseStatus("SUCCESS");
                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        response.put("content", partnerDTOs);
        response.put("totalElements", partnerPage.getTotalElements());
        response.put("totalPages", partnerPage.getTotalPages());
        response.put("currentPage", partnerPage.getNumber());
        return response;
    }
}