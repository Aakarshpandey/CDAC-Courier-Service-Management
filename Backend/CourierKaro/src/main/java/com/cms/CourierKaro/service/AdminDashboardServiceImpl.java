package com.cms.CourierKaro.service;
import com.cms.CourierKaro.dto.AdminStatsDTO;
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
@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {
    private final UserRepository userRepository;
    private final PartnerRepository partnerRepository;
    private final ShipmentRepository shipmentRepository;
    private final PaymentRepository paymentRepository;
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
}