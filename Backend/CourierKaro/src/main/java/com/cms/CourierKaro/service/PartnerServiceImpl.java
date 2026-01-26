package com.cms.CourierKaro.service;

import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.cms.CourierKaro.dto.DailyEarningDTO;
import com.cms.CourierKaro.dto.AvailableOrderDTO;
import com.cms.CourierKaro.dto.PartnerDashboardStatsDTO;
import com.cms.CourierKaro.dto.AcceptedOrderDTO;
import com.cms.CourierKaro.dto.PartnerEarningsBreakdownDTO;
import com.cms.CourierKaro.dto.PartnerEarningsDTO;
import com.cms.CourierKaro.dto.PartnerEarningsShipmentDTO;
import com.cms.CourierKaro.dto.PartnerEarningsHistoryDTO;
import com.cms.CourierKaro.dto.PartnerOnlineStatusResponseDTO;
import com.cms.CourierKaro.dto.PartnerOnlineStatusUpdateDTO;
import com.cms.CourierKaro.dto.PartnerProfileResponseDTO;
import com.cms.CourierKaro.dto.PartnerProfileUpdateDTO;
import com.cms.CourierKaro.dto.PartnerPayoutDTO;
import com.cms.CourierKaro.dto.PartnerRegisterDTO;
import com.cms.CourierKaro.dto.ProfilePhotoResponseDTO;
import com.cms.CourierKaro.dto.TransferEarningsRequestDTO;
import com.cms.CourierKaro.entity.Location;
import com.cms.CourierKaro.entity.Partner;
import com.cms.CourierKaro.entity.PartnerPayout;
import com.cms.CourierKaro.entity.PartnerStatus;
import com.cms.CourierKaro.entity.PaymentStatus;
import com.cms.CourierKaro.entity.Role;
import com.cms.CourierKaro.entity.Shipment;
import com.cms.CourierKaro.entity.Status;
import com.cms.CourierKaro.entity.User;
import com.cms.CourierKaro.entity.VehicleType;
import com.cms.CourierKaro.repository.PartnerPayoutRepository;
import com.cms.CourierKaro.repository.PartnerRepository;
import com.cms.CourierKaro.repository.ShipmentRepository;
import com.cms.CourierKaro.repository.UserRepository;
import com.cms.CourierKaro.repository.VehicleTypeRepository;
import com.cms.CourierKaro.response.PartnerResp;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Locale;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.UUID;

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
	private final PartnerPayoutRepository partnerPayoutRepository;
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

			// `users.email` is globally unique; keep behavior consistent with existing user
			// flow.
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
			partner.setStatus(PartnerStatus.SUSPENDED);

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
					.vehicleTypeName(
							partner.getVehicleTypeId() != null ? partner.getVehicleTypeId().getTypeName() : null)
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

			// Calculate today's earnings (only from completed deliveries; earned when delivered)
			double todayEarnings = allShipments.stream()
					.filter(s -> s.getStatus() == Status.DELIVERED && s.getCalculatedPrice() != null)
					.filter(s -> {
						LocalDateTime earnedAt = s.getDeliveredAt() != null ? s.getDeliveredAt() : s.getCreatedAt();
						return earnedAt != null && !earnedAt.isBefore(startOfDay) && !earnedAt.isAfter(endOfDay);
					})
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

	@Override
	public PartnerProfileResponseDTO updatePartnerProfile(String userEmail, PartnerProfileUpdateDTO dto) {
		try {
			User user = userRepository.findByEmail(userEmail).orElse(null);
			if (user == null) {
				return PartnerProfileResponseDTO.builder().message("User not found").responseStatus("FAILED").build();
			}

			Partner partner = partnerRepository.findByUserId(user).orElse(null);
			if (partner == null) {
				return PartnerProfileResponseDTO.builder().message("Partner profile not found").responseStatus("FAILED")
						.build();
			}

			if (dto.getFirstName() != null)
				user.setFirstName(dto.getFirstName());
			if (dto.getLastName() != null)
				user.setLastName(dto.getLastName());
			if (dto.getPhoneNumber() != null)
				user.setPhoneNumber(dto.getPhoneNumber());

			if (dto.getVehicleModel() != null)
				partner.setVehicleModel(dto.getVehicleModel());
			if (dto.getDriverAddress() != null)
				partner.setDriverAddress(dto.getDriverAddress());
			if (dto.getPreferredCity() != null)
				partner.setPreferredCity(dto.getPreferredCity());
			if (dto.getPincode() != null)
				partner.setPincode(dto.getPincode());
			if (dto.getBankAccountNumber() != null)
				partner.setBankAccountNumber(dto.getBankAccountNumber());

			userRepository.save(user);
			partnerRepository.save(partner);

			// Return fresh profile
			return getPartnerProfile(userEmail);
		} catch (Exception e) {
			return PartnerProfileResponseDTO.builder()
					.message("Failed to update profile: " + e.getMessage())
					.responseStatus("FAILED")
					.build();
		}
	}

	@Override
	public List<com.cms.CourierKaro.dto.PartnerApplicationDTO> getPendingPartners() {
		try {
			// Use the optimized query with JOIN FETCH to avoid N+1 problem
			List<Partner> pendingPartners = partnerRepository.findByIsApprovedWithDetails(false);

			// Map Partner entities to PartnerApplicationDTO
			return pendingPartners.stream()
					.map(this::mapToApplicationDTO)
					.toList();
		} catch (Exception e) {
			throw new RuntimeException("Failed to fetch pending partners: " + e.getMessage(), e);
		}
	}

	@Override
	public PartnerResp approvePartner(Long partnerId) {
		try {
			Partner partner = partnerRepository.findById(partnerId)
					.orElseThrow(() -> new RuntimeException("Partner not found with ID: " + partnerId));

			// Update partner status to INACTIVE and set approved flag
			partner.setStatus(PartnerStatus.INACTIVE);
			partner.setApproved(true);
			partnerRepository.save(partner);

			return new PartnerResp("Partner approved successfully", "SUCCESS");
		} catch (Exception e) {
			return new PartnerResp("Failed to approve partner: " + e.getMessage(), "FAILED");
		}
	}

	@Override
	public ProfilePhotoResponseDTO uploadPartnerProfilePhoto(String userEmail,
			org.springframework.web.multipart.MultipartFile file) {
		try {
			if (file == null || file.isEmpty()) {
				return ProfilePhotoResponseDTO.builder().status("FAILED").message("File is required").build();
			}

			// Basic validation
			if (file.getSize() > 2 * 1024 * 1024) {
				return ProfilePhotoResponseDTO.builder().status("FAILED").message("File too large (max 2MB)").build();
			}

			String contentType = file.getContentType();
			if (contentType == null || !contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
				return ProfilePhotoResponseDTO.builder().status("FAILED").message("Only image files are allowed")
						.build();
			}

			User user = userRepository.findByEmail(userEmail).orElse(null);
			if (user == null) {
				return ProfilePhotoResponseDTO.builder().status("FAILED").message("User not found").build();
			}

			// Save to ./uploads/partners/
			String original = file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename();
			String ext = "";
			int dot = original.lastIndexOf('.');
			if (dot >= 0 && dot < original.length() - 1) {
				ext = original.substring(dot);
			}
			String filename = UUID.randomUUID().toString() + ext;

			Path uploadDir = Paths.get("uploads", "partners");
			Files.createDirectories(uploadDir);
			Path target = uploadDir.resolve(filename);
			Files.write(target, file.getBytes());

			String url = "/uploads/partners/" + filename;
			user.setProfilePhotoUrl(url);
			userRepository.save(user);

			return ProfilePhotoResponseDTO.builder()
					.status("SUCCESS")
					.message("Profile photo uploaded")
					.profilePhotoUrl(url)
					.build();
		} catch (Exception e) {
			return ProfilePhotoResponseDTO.builder().status("FAILED").message("Upload failed: " + e.getMessage())
					.build();
		}
	}

	@Override
	public PartnerResp rejectPartner(Long partnerId) {
		try {
			Partner partner = partnerRepository.findById(partnerId)
					.orElseThrow(() -> new RuntimeException("Partner not found with ID: " + partnerId));

			// Update partner status to DELETED (soft delete)
			partner.setStatus(PartnerStatus.DELETED);
			partner.setApproved(false);
			partnerRepository.save(partner);

			return new PartnerResp("Partner application rejected", "SUCCESS");
		} catch (Exception e) {
			return new PartnerResp("Failed to reject partner: " + e.getMessage(), "FAILED");
		}
	}

	/**
	 * Helper method to map Partner entity to PartnerApplicationDTO
	 * Avoids N+1 problem as userId and vehicleTypeId are already fetched
	 */
	private com.cms.CourierKaro.dto.PartnerApplicationDTO mapToApplicationDTO(Partner partner) {
		com.cms.CourierKaro.dto.PartnerApplicationDTO dto = new com.cms.CourierKaro.dto.PartnerApplicationDTO();

		// Partner basic info
		dto.setPartnerId(partner.getPartnerId());
		dto.setStatus(partner.getStatus());
		dto.setVehicleRegNumber(partner.getVehicleRegNumber());
		dto.setVehicleModel(partner.getVehicleModel());
		dto.setDrivingLiscenseNumber(partner.getDrivingLiscenseNumber());
		dto.setDriverAddress(partner.getDriverAddress());
		dto.setPincode(partner.getPincode());
		dto.setPreferredCity(partner.getPreferredCity());
		dto.setPanNumber(partner.getPanNumber());
		dto.setBankAccountNumber(partner.getBankAccountNumber());
		dto.setAadharNumber(partner.getAadharNumber());
		dto.setValidInsurance(partner.isValidInsurance());
		dto.setApproved(partner.isApproved());
		dto.setOnline(partner.isOnline());
		dto.setAvgRating(partner.getAvgRating());

		// Map User info (already fetched via JOIN FETCH)
		User user = partner.getUserId();
		if (user != null) {
			com.cms.CourierKaro.dto.PartnerApplicationDTO.UserInfoDTO userInfo = new com.cms.CourierKaro.dto.PartnerApplicationDTO.UserInfoDTO();
			userInfo.setId(user.getId());
			userInfo.setFirstName(user.getFirstName());
			userInfo.setLastName(user.getLastName());
			userInfo.setEmail(user.getEmail());
			userInfo.setPhoneNumber(user.getPhoneNumber());
			dto.setUserId(userInfo);
		}

		// Map VehicleType info (already fetched via JOIN FETCH)
		VehicleType vehicleType = partner.getVehicleTypeId();
		if (vehicleType != null) {
			com.cms.CourierKaro.dto.PartnerApplicationDTO.VehicleTypeInfoDTO vehicleInfo = new com.cms.CourierKaro.dto.PartnerApplicationDTO.VehicleTypeInfoDTO();
			vehicleInfo.setVehicleTypeId(vehicleType.getId());
			vehicleInfo.setTypeName(vehicleType.getTypeName());
			dto.setVehicleTypeId(vehicleInfo);
		}

		return dto;
	}

	// Add imports: PartnerPayoutRepository, PartnerEarningsHistoryDTO, etc.
	// Inject PartnerPayoutRepository

	@Override
	public PartnerEarningsHistoryDTO getEarningsHistory(String userEmail, Timestamp startDate, Timestamp endDate,
			Pageable pageable) {
		User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
		Partner partner = partnerRepository.findByUserId(user)
				.orElseThrow(() -> new RuntimeException("Partner not found"));

		if (partner == null) {
			throw new RuntimeException("Partner not found");
		}

		Page<DailyEarningDTO> page = partnerPayoutRepository.findEarningsHistory(partner, startDate, endDate, pageable);
		Double total = partnerPayoutRepository.calculateTotalEarnings(partner);

		return PartnerEarningsHistoryDTO.builder()
				.totalEarnings(BigDecimal.valueOf(total != null ? total : 0.0))
				.earnings(page.getContent())
				.build();
	}

	@Override
	public ProfilePhotoResponseDTO removePartnerProfilePhoto(String userEmail) {
		try {
			User user = userRepository.findByEmail(userEmail).orElse(null);
			if (user == null) {
				return ProfilePhotoResponseDTO.builder().status("FAILED").message("User not found").build();
			}

			user.setProfilePhotoUrl(null);
			userRepository.save(user);

			return ProfilePhotoResponseDTO.builder()
					.status("SUCCESS")
					.message("Profile photo removed")
					.profilePhotoUrl(null)
					.build();
		} catch (Exception e) {
			return ProfilePhotoResponseDTO.builder().status("FAILED")
					.message("Failed to remove photo: " + e.getMessage()).build();
		}
	}

	@Override
	public List<AvailableOrderDTO> getAvailableOrders(String userEmail) {
		try {
			User user = userRepository.findByEmail(userEmail).orElse(null);
			if (user == null) {
				return List.of();
			}

			Partner partner = partnerRepository.findByUserId(user).orElse(null);
			if (partner == null || !partner.isOnline()) {
				return List.of();
			}

			int partnerPincode = partner.getPincode();
			String partnerPincodeStr = String.valueOf(partnerPincode);

			// Get all PENDING shipments (available orders)
			List<Shipment> allPending = shipmentRepository.findAll().stream()
					.filter(s -> s.getStatus() == Status.PENDING && s.getPartnerId() == null)
					.toList();

			// Filter by pincode match (pickup or delivery location pincode matches partner
			// pincode)
			return allPending.stream()
					.filter(s -> {
						Location pickup = s.getPickupLocationId();
						Location delivery = s.getDeliveryLocationId();

						boolean pickupMatch = pickup != null && pickup.getPincode() != null
								&& pickup.getPincode().equals(partnerPincodeStr);
						boolean deliveryMatch = delivery != null && delivery.getPincode() != null
								&& delivery.getPincode().equals(partnerPincodeStr);

						return pickupMatch || deliveryMatch;
					})
					.map(s -> {
						Location pickup = s.getPickupLocationId();
						Location delivery = s.getDeliveryLocationId();
						User customer = s.getCustormerId();

						return AvailableOrderDTO.builder()
								.shipmentId(s.getShipmentId())
								.pickupAddress(s.getPickupAddress())
								.deliveryAddress(s.getDeliveryAddress())
								.pickupPincode(pickup != null ? pickup.getPincode() : null)
								.deliveryPincode(delivery != null ? delivery.getPincode() : null)
								.distanceKm(s.getDistanceKm())
								.calculatedPrice(s.getCalculatedPrice())
								.packageType(s.getPackageType() != null ? s.getPackageType().toString() : null)
								.weightKg(s.getWeightKg())
								.vehicleTypeName(
										s.getVehicleTypeId() != null ? s.getVehicleTypeId().getTypeName() : null)
								.createdAt(s.getCreatedAt())
								.customerName(
										customer != null
												? (customer.getFirstName() + " "
														+ (customer.getLastName() != null ? customer.getLastName()
																: ""))
														.trim()
												: "Unknown")
								.build();
					})
					.toList();
		} catch (Exception e) {
			return List.of();
		}
	}

	@Override
	public List<PartnerPayoutDTO> getPartnerPayouts(String userEmail) {
		try {
			User user = userRepository.findByEmail(userEmail).orElse(null);
			if (user == null) {
				return List.of();
			}

			Partner partner = partnerRepository.findByUserId(user).orElse(null);
			if (partner == null) {
				return List.of();
			}

			List<PartnerPayout> payouts = partnerPayoutRepository.findByPartnerOrderByPaidAtDesc(partner);

			return payouts.stream()
					.map(p -> PartnerPayoutDTO.builder()
							.payoutId(p.getPayoutId())
							.shipmentId(p.getShipment() != null ? p.getShipment().getShipmentId() : null)
							.amount(p.getAmount())
							.paymentStatus(p.getPaymentStatus() != null ? p.getPaymentStatus().toString() : null)
							.paidAt(p.getPaidAt())
							.status("SUCCESS")
							.build())
					.toList();
		} catch (Exception e) {
			return List.of();
		}
	}

	@Override
	public PartnerPayoutDTO transferEarnings(String userEmail, TransferEarningsRequestDTO dto) {
		try {
			if (dto.getAmount() == null || dto.getAmount() <= 0) {
				return PartnerPayoutDTO.builder()
						.status("FAILED")
						.message("Invalid amount")
						.build();
			}

			User user = userRepository.findByEmail(userEmail).orElse(null);
			if (user == null) {
				return PartnerPayoutDTO.builder()
						.status("FAILED")
						.message("User not found")
						.build();
			}

			Partner partner = partnerRepository.findByUserId(user).orElse(null);
			if (partner == null) {
				return PartnerPayoutDTO.builder()
						.status("FAILED")
						.message("Partner profile not found")
						.build();
			}

			if (partner.getBankAccountNumber() == null) {
				return PartnerPayoutDTO.builder()
						.status("FAILED")
						.message("Bank account number not set. Please update your profile.")
						.build();
			}

			// Calculate available earnings (from completed deliveries not yet paid out)
			List<Shipment> completedShipments = shipmentRepository.findByPartnerId(partner).stream()
					.filter(s -> s.getStatus() == Status.DELIVERED && s.getCalculatedPrice() != null)
					.toList();

			// Get already paid out shipments
			List<Long> paidShipmentIds = partnerPayoutRepository.findByPartner(partner).stream()
					.filter(p -> p.getShipment() != null)
					.map(p -> p.getShipment().getShipmentId())
					.toList();

			double availableEarnings = completedShipments.stream()
					.filter(s -> !paidShipmentIds.contains(s.getShipmentId()))
					.mapToDouble(s -> s.getCalculatedPrice().doubleValue())
					.sum();

			if (dto.getAmount() > availableEarnings) {
				return PartnerPayoutDTO.builder()
						.status("FAILED")
						.message("Insufficient earnings. Available: ₹" + availableEarnings)
						.build();
			}

			// Create payout record (simplified - in real system, this would trigger payment
			// gateway)
			PartnerPayout payout = new PartnerPayout();
			payout.setPartner(partner);
			payout.setAmount(dto.getAmount());
			payout.setPaymentStatus(PaymentStatus.PENDING);
			payout.setPaidAt(null); // Will be set when payment is processed
			// Note: shipment is null for manual transfers
			partnerPayoutRepository.save(payout);

			return PartnerPayoutDTO.builder()
					.payoutId(payout.getPayoutId())
					.amount(payout.getAmount())
					.paymentStatus(payout.getPaymentStatus().toString())
					.status("SUCCESS")
					.message("Transfer request submitted. Amount will be transferred to your bank account.")
					.build();
		} catch (Exception e) {
			return PartnerPayoutDTO.builder()
					.status("FAILED")
					.message("Transfer failed: " + e.getMessage())
					.build();
		}
	}

	@Override
	public PartnerEarningsDTO getPartnerEarnings(String userEmail, String period) {
		try {
			User user = userRepository.findByEmail(userEmail).orElse(null);
			if (user == null) {
				return PartnerEarningsDTO.builder()
						.message("User not found")
						.status("FAILED")
						.build();
			}

			Partner partner = partnerRepository.findByUserId(user).orElse(null);
			if (partner == null) {
				return PartnerEarningsDTO.builder()
						.message("Partner profile not found")
						.status("FAILED")
						.build();
			}

			final String p = period == null ? "WEEK" : period.trim().toUpperCase(Locale.ROOT);
			final boolean isMonth = "MONTH".equals(p);
			final String normalizedPeriod = isMonth ? "MONTH" : "WEEK";

			final LocalDate today = LocalDate.now();
			final LocalDate startDate = isMonth
					? today.withDayOfMonth(1)
					: today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
			final LocalDateTime start = startDate.atStartOfDay();
			final LocalDateTime end = today.atTime(23, 59, 59);

			final List<Shipment> deliveredShipments = shipmentRepository.findByPartnerId(partner).stream()
					.filter(s -> s.getStatus() == Status.DELIVERED && s.getCalculatedPrice() != null)
					.filter(s -> {
						// When earnings are "earned": deliveredAt; fallback to createdAt if deliveredAt is missing
						LocalDateTime earnedAt = s.getDeliveredAt() != null ? s.getDeliveredAt() : s.getCreatedAt();
						return earnedAt != null && !earnedAt.isBefore(start) && !earnedAt.isAfter(end);
					})
					.toList();

			final double total = deliveredShipments.stream()
					.mapToDouble(s -> s.getCalculatedPrice().doubleValue())
					.sum();

			final DateTimeFormatter dayLabelFmt = DateTimeFormatter.ofPattern("EEE, MMM d", Locale.ENGLISH);

			final List<PartnerEarningsBreakdownDTO> breakdown = new ArrayList<>();
			if (!isMonth) {
				Map<LocalDate, List<Shipment>> byDay = deliveredShipments.stream()
						.collect(Collectors.groupingBy(s -> {
							LocalDateTime earnedAt = s.getDeliveredAt() != null ? s.getDeliveredAt() : s.getCreatedAt();
							return earnedAt.toLocalDate();
						}));

				for (LocalDate d = startDate; !d.isAfter(today); d = d.plusDays(1)) {
					List<Shipment> dayShipments = byDay.getOrDefault(d, List.of());
					double dayTotal = dayShipments.stream().mapToDouble(s -> s.getCalculatedPrice().doubleValue()).sum();
					breakdown.add(PartnerEarningsBreakdownDTO.builder()
							.label(d.format(dayLabelFmt))
							.deliveries(dayShipments.size())
							.earnings(dayTotal)
							.build());
				}
			} else {
				// Group by "week of month" buckets: Week 1 = days 1-7, Week 2 = 8-14, etc.
				Map<Integer, List<Shipment>> byWeek = deliveredShipments.stream()
						.collect(Collectors.groupingBy(s -> {
							LocalDateTime earnedAt = s.getDeliveredAt() != null ? s.getDeliveredAt() : s.getCreatedAt();
							int dom = earnedAt.toLocalDate().getDayOfMonth();
							return ((dom - 1) / 7) + 1;
						}));

				int lastWeekIndex = ((today.getDayOfMonth() - 1) / 7) + 1;
				for (int w = 1; w <= lastWeekIndex; w++) {
					List<Shipment> weekShipments = byWeek.getOrDefault(w, List.of());
					double weekTotal = weekShipments.stream().mapToDouble(s -> s.getCalculatedPrice().doubleValue())
							.sum();
					breakdown.add(PartnerEarningsBreakdownDTO.builder()
							.label("Week " + w)
							.deliveries(weekShipments.size())
							.earnings(weekTotal)
							.build());
				}
			}

			final List<PartnerEarningsShipmentDTO> shipments = deliveredShipments.stream()
					.sorted(Comparator.comparing((Shipment s) -> {
						LocalDateTime earnedAt = s.getDeliveredAt() != null ? s.getDeliveredAt() : s.getCreatedAt();
						return earnedAt;
					}, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
					.map(s -> {
						LocalDateTime earnedAt = s.getDeliveredAt() != null ? s.getDeliveredAt() : s.getCreatedAt();
						return PartnerEarningsShipmentDTO.builder()
								.shipmentId(s.getShipmentId())
								.earnedAt(earnedAt)
								.amount(s.getCalculatedPrice().doubleValue())
								.pickupAddress(s.getPickupAddress())
								.deliveryAddress(s.getDeliveryAddress())
								.build();
					})
					.toList();

			return PartnerEarningsDTO.builder()
					.period(normalizedPeriod)
					.fromDate(startDate.toString())
					.toDate(today.toString())
					.deliveries(deliveredShipments.size())
					.totalEarnings(total)
					.bonus(0.0)
					.breakdown(breakdown)
					.shipments(shipments)
					.message("Earnings loaded successfully")
					.status("SUCCESS")
					.build();
		} catch (Exception e) {
			return PartnerEarningsDTO.builder()
					.message("Failed to load earnings: " + e.getMessage())
					.status("FAILED")
					.build();
		}
	}

	@Override
	public AcceptedOrderDTO acceptOrder(String userEmail, Long shipmentId) {
		try {
			User user = userRepository.findByEmail(userEmail).orElse(null);
			if (user == null) {
				return AcceptedOrderDTO.builder()
						.message("User not found")
						.build();
			}

			Partner partner = partnerRepository.findByUserId(user).orElse(null);
			if (partner == null) {
				return AcceptedOrderDTO.builder()
						.message("Partner profile not found")
						.build();
			}

			if (!partner.isOnline()) {
				return AcceptedOrderDTO.builder()
						.message("You must be online to accept orders")
						.build();
			}

			Shipment shipment = shipmentRepository.findById(shipmentId).orElse(null);
			if (shipment == null) {
				return AcceptedOrderDTO.builder()
						.message("Shipment not found")
						.build();
			}

			if (shipment.getStatus() != Status.PENDING) {
				return AcceptedOrderDTO.builder()
						.message("This order is no longer available")
						.build();
			}

			if (shipment.getPartnerId() != null) {
				return AcceptedOrderDTO.builder()
						.message("This order has already been assigned to another partner")
						.build();
			}

			// Assign partner and update status
			shipment.setPartnerId(partner);
			shipment.setStatus(Status.ASSIGNED);
			shipment = shipmentRepository.save(shipment);

			// Build response DTO
			User customer = shipment.getCustormerId();
			Location pickupLoc = shipment.getPickupLocationId();
			Location deliveryLoc = shipment.getDeliveryLocationId();

			return AcceptedOrderDTO.builder()
					.shipmentId(shipment.getShipmentId())
					.status(shipment.getStatus() != null ? shipment.getStatus().toString() : "ASSIGNED")
					.pickupAddress(shipment.getPickupAddress())
					.pickupContactName(shipment.getPickupContactName())
					.pickupPhone(shipment.getPickupPhone())
					.pickupPincode(pickupLoc != null ? pickupLoc.getPincode() : null)
					.deliveryAddress(shipment.getDeliveryAddress())
					.deliveryContactName(shipment.getDeliveryContactName())
					.deliveryPhone(shipment.getDeliveryPhone())
					.deliveryPincode(deliveryLoc != null ? deliveryLoc.getPincode() : null)
					.packageType(shipment.getPackageType() != null ? shipment.getPackageType().toString() : null)
					.weightKg(shipment.getWeightKg())
					.vehicleTypeName(shipment.getVehicleTypeId() != null ? shipment.getVehicleTypeId().getTypeName() : null)
					.distanceKm(shipment.getDistanceKm())
					.calculatedPrice(shipment.getCalculatedPrice())
					.customerName(customer != null ? (customer.getFirstName() + " " + (customer.getLastName() != null ? customer.getLastName() : "")).trim() : "Unknown")
					.customerPhone(customer != null ? customer.getPhoneNumber() : null)
					.createdAt(shipment.getCreatedAt())
					.message("Order accepted successfully")
					.build();
		} catch (Exception e) {
			return AcceptedOrderDTO.builder()
					.message("Failed to accept order: " + e.getMessage())
					.build();
		}
	}
}
