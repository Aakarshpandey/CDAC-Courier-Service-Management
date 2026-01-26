package com.cms.CourierKaro.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.cms.CourierKaro.dto.PartnerDashboardStatsDTO;
import com.cms.CourierKaro.dto.PartnerOnlineStatusResponseDTO;
import com.cms.CourierKaro.dto.PartnerOnlineStatusUpdateDTO;
import com.cms.CourierKaro.dto.PartnerProfileResponseDTO;
import com.cms.CourierKaro.dto.PartnerRegisterDTO;
import com.cms.CourierKaro.entity.Partner;
import com.cms.CourierKaro.entity.PartnerStatus;
import com.cms.CourierKaro.entity.Role;
import com.cms.CourierKaro.entity.Shipment;
import com.cms.CourierKaro.entity.Status;
import com.cms.CourierKaro.entity.User;
import com.cms.CourierKaro.entity.VehicleType;
import com.cms.CourierKaro.repository.PartnerRepository;
import com.cms.CourierKaro.repository.ShipmentRepository;
import com.cms.CourierKaro.repository.UserRepository;
import com.cms.CourierKaro.repository.VehicleTypeRepository;
import com.cms.CourierKaro.response.PartnerResp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PartnerServiceImpl implements PartnerService {

	private final UserRepository userRepository;
	private final PartnerRepository partnerRepository;
	private final VehicleTypeRepository vehicleTypeRepository;
	private final ShipmentRepository shipmentRepository;
	private final ModelMapper modelMapper;

	@Override
	public PartnerResp registerPartner(PartnerRegisterDTO dto) {
		try {
			if (dto.getPassword() == null || !dto.getPassword().equals(dto.getConfirmPassword())) {
				return new PartnerResp("Password does not match", "FAILED");
			}

			if (dto.getEmail() == null || dto.getEmail().isBlank()) {
				return new PartnerResp("Email is required", "FAILED");
			}

			// `users.email` is globally unique; keep behavior consistent with existing user flow.
			if (userRepository.existsByEmail(dto.getEmail())) {
				return new PartnerResp("Email already registered", "EMAIL_EXIST");
			}

			VehicleType vehicleType = null;
			if (dto.getVehicleTypeId() != null) {
				vehicleType = vehicleTypeRepository.findById(dto.getVehicleTypeId()).orElse(null);
			} else if (dto.getVehicleTypeName() != null && !dto.getVehicleTypeName().isBlank()) {
				final String rawName = dto.getVehicleTypeName().trim();
				final String canonicalName = canonicalizeVehicleTypeName(rawName);

				// 1) Exact (case-insensitive) match
				vehicleType = vehicleTypeRepository.findByTypeNameIgnoreCase(canonicalName);

				// 2) Backwards compatibility: try raw name and simplified segment
				if (vehicleType == null) {
					vehicleType = vehicleTypeRepository.findByTypeNameIgnoreCase(rawName);
				}
				if (vehicleType == null) {
					String simplified = rawName.replaceAll("\\(.*?\\)", "").trim(); // drop "(...)" if any
					if (simplified.contains("/")) {
						simplified = simplified.split("/")[0].trim();
					}
					if (!simplified.isBlank()) {
						vehicleType = vehicleTypeRepository.findByTypeNameIgnoreCase(simplified);
					}
				}

				// 3) Fallback: scan all vehicle types with normalization/containment
				if (vehicleType == null) {
					final String normalizedNeedle = normalizeVehicleType(rawName);
					List<VehicleType> all = vehicleTypeRepository.findAll();
					for (VehicleType vt : all) {
						if (vt == null || vt.getTypeName() == null)
							continue;
						final String normalizedHay = normalizeVehicleType(vt.getTypeName());
						if (normalizedHay.equals(normalizedNeedle)
								|| normalizedHay.contains(normalizedNeedle)
								|| normalizedNeedle.contains(normalizedHay)) {
							vehicleType = vt;
							break;
						}
					}
				}

				// 4) If still not found, create it (user asked to "make them" if not present)
				if (vehicleType == null) {
					VehicleType created = new VehicleType();
					created.setTypeName(canonicalName);
					created.setBaseFare(BigDecimal.ZERO);
					created.setPerKmRate(BigDecimal.ZERO);
					created.setMaxWeigthKg(BigDecimal.ZERO);
					vehicleType = vehicleTypeRepository.save(created);
				}
			}

			if (vehicleType == null) {
				return new PartnerResp(
						"Vehicle type is required and must be valid"
								+ (dto.getVehicleTypeName() != null ? " (got: " + dto.getVehicleTypeName() + ")" : ""),
						"FAILED");
			}

			User user = modelMapper.map(dto, User.class);
			user.setPassword(dto.getPassword());
			user.setRole(Role.ROLE_PARTNER);

			User savedUser = userRepository.save(user);

			Partner partner = new Partner();
			partner.setUserId(savedUser);
			partner.setVehicleTypeId(vehicleType);
			partner.setVehicleRegNumber(dto.getVehicleRegNumber());
			partner.setVehicleModel(dto.getVehicleModel());
			partner.setDrivingLiscenseNumber(dto.getDrivingLiscenseNumber());
			partner.setDriverAddress(dto.getDriverAddress());
			partner.setPincode(dto.getPincode() == null ? 0 : dto.getPincode());
			partner.setPreferredCity(dto.getPreferredCity());
			partner.setPanNumber(dto.getPanNumber());
			partner.setBankAccountNumber(dto.getBankAccountNumber());
			partner.setAadharNumber(dto.getAadharNumber());
			partner.setValidInsurance(dto.getValidInsurance() != null && dto.getValidInsurance());

			// Defaults
			partner.setApproved(false);
			partner.setOnline(false);
			partner.setAvgRating(0.0);
			partner.setStatus(PartnerStatus.INACTIVE);

			Partner savedPartner = partnerRepository.save(partner);

			return new PartnerResp(
					"Partner registered successfully",
					"SUCCESS",
					savedUser.getId(),
					savedPartner.getPartnerId());
		} catch (Exception e) {
			return new PartnerResp("Partner registration failed: " + e.getMessage(), "FAILED");
		}
	}

	private static String normalizeVehicleType(String input) {
		if (input == null)
			return "";
		// keep alphanumerics, collapse spaces, lowercase
		return input
				.toLowerCase()
				.replaceAll("[^a-z0-9]+", " ")
				.trim()
				.replaceAll("\\s+", " ");
	}

	private static String canonicalizeVehicleTypeName(String raw) {
		if (raw == null)
			return "";
		String n = normalizeVehicleType(raw);
		// Map UI labels to canonical DB names
		if (n.contains("bike") || n.contains("scooter"))
			return "Bike";
		if (n.contains("auto") || n.contains("rickshaw"))
			return "Auto Rickshaw";
		if (n.contains("car") || n.contains("sedan"))
			return "Car";
		if (n.contains("small") && n.contains("truck"))
			return "Small Truck";
		if (n.contains("large") && n.contains("truck"))
			return "Large Truck";

		// Default: try to title-case the raw (best effort)
		String simplified = raw.trim();
		if (simplified.contains("/"))
			simplified = simplified.split("/")[0].trim();
		if (simplified.isBlank())
			return raw.trim();
		return Character.toUpperCase(simplified.charAt(0)) + simplified.substring(1);
	}

	@Override
	public PartnerProfileResponseDTO getPartnerProfile(String userEmail) {
		try {
			User user = userRepository.findByEmail(userEmail).orElse(null);
			if (user == null) {
				return PartnerProfileResponseDTO.builder()
						.message("User not found")
						.responseStatus("FAILED")
						.build();
			}

			Partner partner = partnerRepository.findByUserId(user).orElse(null);
			if (partner == null) {
				return PartnerProfileResponseDTO.builder()
						.message("Partner profile not found")
						.responseStatus("FAILED")
						.build();
			}

			return PartnerProfileResponseDTO.builder()
					.partnerId(partner.getPartnerId())
					.userId(user.getId())
					.firstName(user.getFirstName())
					.lastName(user.getLastName())
					.email(user.getEmail())
					.phoneNumber(user.getPhoneNumber())
					.profilePhotoUrl(user.getProfilePhotoUrl())
					.vehicleTypeName(partner.getVehicleTypeId() != null ? partner.getVehicleTypeId().getTypeName() : null)
					.vehicleRegNumber(partner.getVehicleRegNumber())
					.vehicleModel(partner.getVehicleModel())
					.drivingLicenseNumber(partner.getDrivingLiscenseNumber())
					.driverAddress(partner.getDriverAddress())
					.pincode(partner.getPincode())
					.preferredCity(partner.getPreferredCity())
					.panNumber(partner.getPanNumber())
					.bankAccountNumber(partner.getBankAccountNumber())
					.aadharNumber(partner.getAadharNumber())
					.validInsurance(partner.isValidInsurance())
					.isApproved(partner.isApproved())
					.isOnline(partner.isOnline())
					.avgRating(partner.getAvgRating())
					.status(partner.getStatus() != null ? partner.getStatus().toString() : null)
					.message("Partner profile loaded successfully")
					.responseStatus("SUCCESS")
					.build();
		} catch (Exception e) {
			return PartnerProfileResponseDTO.builder()
					.message("Failed to load partner profile: " + e.getMessage())
					.responseStatus("FAILED")
					.build();
		}
	}

	@Override
	public PartnerDashboardStatsDTO getPartnerDashboardStats(String userEmail) {
		try {
			User user = userRepository.findByEmail(userEmail).orElse(null);
			if (user == null) {
				return PartnerDashboardStatsDTO.builder()
						.message("User not found")
						.status("FAILED")
						.build();
			}

			Partner partner = partnerRepository.findByUserId(user).orElse(null);
			if (partner == null) {
				return PartnerDashboardStatsDTO.builder()
						.message("Partner profile not found")
						.status("FAILED")
						.build();
			}

			List<Shipment> allShipments = shipmentRepository.findByPartnerId(partner);
			
			// Calculate today's date range
			LocalDate today = LocalDate.now();
			LocalDateTime startOfDay = today.atStartOfDay();
			LocalDateTime endOfDay = today.atTime(23, 59, 59);

			// Filter today's shipments
			List<Shipment> todayShipments = allShipments.stream()
					.filter(s -> s.getCreatedAt() != null 
							&& !s.getCreatedAt().isBefore(startOfDay)
							&& !s.getCreatedAt().isAfter(endOfDay))
					.toList();

			// Calculate today's orders count
			int todayOrdersCount = todayShipments.size();

			// Calculate today's earnings (only from completed deliveries)
			double todayEarnings = todayShipments.stream()
					.filter(s -> s.getStatus() == Status.DELIVERED && s.getCalculatedPrice() != null)
					.mapToDouble(s -> s.getCalculatedPrice().doubleValue())
					.sum();

			// Calculate total earnings (only from completed deliveries)
			double totalEarnings = allShipments.stream()
					.filter(s -> s.getStatus() == Status.DELIVERED && s.getCalculatedPrice() != null)
					.mapToDouble(s -> s.getCalculatedPrice().doubleValue())
					.sum();

			// Count completed deliveries
			int completedDeliveries = (int) allShipments.stream()
					.filter(s -> s.getStatus() == Status.DELIVERED)
					.count();

			// Calculate total distance (only if partner has orders)
			Double totalDistanceKm = null;
			if (!allShipments.isEmpty()) {
				totalDistanceKm = allShipments.stream()
						.filter(s -> s.getDistanceKm() != null)
						.mapToDouble(s -> s.getDistanceKm().doubleValue())
						.sum();
			}

			return PartnerDashboardStatsDTO.builder()
					.todayOrders(todayOrdersCount)
					.todayEarnings(todayEarnings)
					.totalEarnings(totalEarnings)
					.completedDeliveries(completedDeliveries)
					.avgRating(partner.getAvgRating())
					.totalDistanceKm(totalDistanceKm) // null if no orders
					.message("Dashboard stats loaded successfully")
					.status("SUCCESS")
					.build();
		} catch (Exception e) {
			return PartnerDashboardStatsDTO.builder()
					.message("Failed to load dashboard stats: " + e.getMessage())
					.status("FAILED")
					.build();
		}
	}

	@Override
	public PartnerOnlineStatusResponseDTO updateOnlineStatus(String userEmail, PartnerOnlineStatusUpdateDTO dto) {
		try {
			if (dto == null || dto.getIsOnline() == null) {
				return PartnerOnlineStatusResponseDTO.builder()
						.status("FAILED")
						.message("isOnline is required")
						.build();
			}

			User user = userRepository.findByEmail(userEmail).orElse(null);
			if (user == null) {
				return PartnerOnlineStatusResponseDTO.builder()
						.status("FAILED")
						.message("User not found")
						.build();
			}

			Partner partner = partnerRepository.findByUserId(user).orElse(null);
			if (partner == null) {
				return PartnerOnlineStatusResponseDTO.builder()
						.status("FAILED")
						.message("Partner profile not found")
						.build();
			}

			partner.setOnline(dto.getIsOnline());
			partnerRepository.save(partner);

			return PartnerOnlineStatusResponseDTO.builder()
					.status("SUCCESS")
					.message("Online status updated")
					.isOnline(partner.isOnline())
					.build();
		} catch (Exception e) {
			return PartnerOnlineStatusResponseDTO.builder()
					.status("FAILED")
					.message("Failed to update status: " + e.getMessage())
					.build();
		}
	}
}

