package com.cms.CourierKaro.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
@RequestMapping("/api/partner")
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
	
	@GetMapping("/applications")
	public ResponseEntity<?> getPartnerApplications(){
		
	}
	
	
}

