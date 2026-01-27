package com.cms.CourierKaro.service;
import com.cms.CourierKaro.dto.PricingRequestDTO;
import com.cms.CourierKaro.dto.PricingResponseDTO;
import com.cms.CourierKaro.entity.Location;
import com.cms.CourierKaro.entity.VehicleType;
import com.cms.CourierKaro.repository.LocationRepository;
import com.cms.CourierKaro.repository.VehicleTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
@Service
@RequiredArgsConstructor
public class PricingServiceImpl implements PricingService {
    private final LocationRepository locationRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    @Override
    public PricingResponseDTO calculatePrice(PricingRequestDTO request) {
        Location pickup = locationRepository.findById(request.getPickupLocationId())
                .orElseThrow(() -> new RuntimeException("Pickup location not found"));
        Location delivery = locationRepository.findById(request.getDeliveryLocationId())
                .orElseThrow(() -> new RuntimeException("Delivery location not found"));
        VehicleType vehicle = vehicleTypeRepository.findById(request.getVehicleTypeId())
                .orElseThrow(() -> new RuntimeException("Vehicle type not found"));
        double distance = calculateDistance(pickup.getLat(), pickup.getLng(), delivery.getLat(), delivery.getLng());
        
        BigDecimal baseFare = vehicle.getBaseFare();
        BigDecimal perKmRate = vehicle.getPerKmRate();
        BigDecimal distanceCharge = perKmRate.multiply(BigDecimal.valueOf(distance)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalPrice = baseFare.add(distanceCharge).setScale(2, RoundingMode.HALF_UP);
        return PricingResponseDTO.builder()
                .baseFare(baseFare)
                .distanceCharge(distanceCharge)
                .totalPrice(totalPrice)
                .distanceKm(Math.round(distance * 100.0) / 100.0)
                .vehicleType(vehicle.getTypeName())
                .build();
    }
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}