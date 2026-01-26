package com.cms.CourierKaro.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.cms.CourierKaro.dto.PartnerRegisterDTO;
import com.cms.CourierKaro.entity.Partner;
import com.cms.CourierKaro.entity.PartnerStatus;
import com.cms.CourierKaro.entity.Role;
import com.cms.CourierKaro.entity.User;
import com.cms.CourierKaro.entity.VehicleType;
import com.cms.CourierKaro.repository.PartnerRepository;
import com.cms.CourierKaro.repository.UserRepository;
import com.cms.CourierKaro.repository.VehicleTypeRepository;
import com.cms.CourierKaro.response.PartnerResp;

import java.math.BigDecimal;
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
}

