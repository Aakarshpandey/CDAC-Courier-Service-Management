package com.cms.CourierKaro.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.CourierKaro.dto.PartnerApplicationDTO;
import com.cms.CourierKaro.dto.PartnerDashboardStatsDTO;
import com.cms.CourierKaro.dto.PartnerOnlineStatusResponseDTO;
import com.cms.CourierKaro.dto.PartnerOnlineStatusUpdateDTO;
import com.cms.CourierKaro.dto.PartnerProfileResponseDTO;
import com.cms.CourierKaro.dto.PartnerRegisterDTO;
import com.cms.CourierKaro.response.PartnerResp;
import com.cms.CourierKaro.service.PartnerService;
import com.cms.CourierKaro.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/partners")
public class PartnerController {

	private final PartnerService partnerService;
	private final JwtTokenProvider jwtTokenProvider;

	@PostMapping("/register")
	public ResponseEntity<?> partnerRegistration(@RequestBody PartnerRegisterDTO partnerRegisterDTO) {
		PartnerResp response = partnerService.registerPartner(partnerRegisterDTO);
		System.out.println(response);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/profile")
	public ResponseEntity<?> getPartnerProfile(
			Principal principal,
			@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
		String userEmail = resolveEmail(principal, authorizationHeader);
		if (userEmail == null) {
			return ResponseEntity.badRequest().body(
					PartnerProfileResponseDTO.builder()
							.message("Authentication required")
							.responseStatus("FAILED")
							.build());
		}
		PartnerProfileResponseDTO response = partnerService.getPartnerProfile(userEmail);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/dashboard/stats")
	public ResponseEntity<?> getPartnerDashboardStats(
			Principal principal,
			@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
		String userEmail = resolveEmail(principal, authorizationHeader);
		if (userEmail == null) {
			return ResponseEntity.badRequest().body(
					PartnerDashboardStatsDTO.builder()
							.message("Authentication required")
							.status("FAILED")
							.build());
		}
		PartnerDashboardStatsDTO response = partnerService.getPartnerDashboardStats(userEmail);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/online-status")
	public ResponseEntity<?> updateOnlineStatus(
			Principal principal,
			@RequestHeader(value = "Authorization", required = false) String authorizationHeader,
			@RequestBody PartnerOnlineStatusUpdateDTO dto) {
		String userEmail = resolveEmail(principal, authorizationHeader);
		if (userEmail == null) {
			return ResponseEntity.badRequest().body(
					PartnerOnlineStatusResponseDTO.builder()
							.message("Authentication required")
							.status("FAILED")
							.build());
		}
		PartnerOnlineStatusResponseDTO response = partnerService.updateOnlineStatus(userEmail, dto);
		return ResponseEntity.ok(response);
	}

	private String resolveEmail(Principal principal, String authorizationHeader) {
		if (principal != null) {
			return principal.getName();
		}
		if (authorizationHeader == null || authorizationHeader.isBlank()) {
			return null;
		}
		String prefix = "Bearer ";
		if (!authorizationHeader.startsWith(prefix)) {
			return null;
		}
		String token = authorizationHeader.substring(prefix.length()).trim();
		if (token.isEmpty()) {
			return null;
		}
		if (!jwtTokenProvider.validateToken(token)) {
			return null;
		}
		return jwtTokenProvider.getEmailFromToken(token);
	}
	
	/**
	 * Get all suspended partner applications
	 * @return List of partner applications with SUSPENDED status
	 */
	@GetMapping("/applications")
	public ResponseEntity<List<PartnerApplicationDTO>> getPartnerApplications() {
		List<PartnerApplicationDTO> applications = partnerService.getSuspendedPartners();
		return ResponseEntity.ok(applications);
	}
	
	/**
	 * Approve a partner application
	 * @param partnerId The ID of the partner to approve
	 * @return Response indicating success or failure
	 */
	@PutMapping("/approve/{partnerId}")
	public ResponseEntity<PartnerResp> approvePartner(@PathVariable Long partnerId) {
		PartnerResp response = partnerService.approvePartner(partnerId);
		return ResponseEntity.ok(response);
	}
	
	/**
	 * Reject a partner application
	 * @param partnerId The ID of the partner to reject
	 * @return Response indicating success or failure
	 */
	@PutMapping("/reject/{partnerId}")
	public ResponseEntity<PartnerResp> rejectPartner(@PathVariable Long partnerId) {
		PartnerResp response = partnerService.rejectPartner(partnerId);
		return ResponseEntity.ok(response);
	}
	
	
}

