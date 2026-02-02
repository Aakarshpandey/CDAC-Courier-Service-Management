package com.cms.CourierKaro.controller;

import java.security.Principal;
import java.sql.Timestamp;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cms.CourierKaro.dto.AcceptedOrderDTO;
import com.cms.CourierKaro.dto.AvailableOrderDTO;
import com.cms.CourierKaro.dto.PartnerApplicationDTO;
import com.cms.CourierKaro.dto.PartnerDashboardStatsDTO;
import com.cms.CourierKaro.dto.PartnerEarningsDTO;
import com.cms.CourierKaro.dto.PartnerEarningsHistoryDTO;
import com.cms.CourierKaro.dto.PartnerOnlineStatusResponseDTO;
import com.cms.CourierKaro.dto.PartnerOnlineStatusUpdateDTO;
import com.cms.CourierKaro.dto.PartnerPayoutDTO;
import com.cms.CourierKaro.dto.PartnerProfileResponseDTO;
import com.cms.CourierKaro.dto.PartnerProfileUpdateDTO;
import com.cms.CourierKaro.dto.PartnerRegisterDTO;
import com.cms.CourierKaro.dto.ProfilePhotoResponseDTO;
import com.cms.CourierKaro.dto.TransferEarningsRequestDTO;
import com.cms.CourierKaro.response.PartnerResp;
import com.cms.CourierKaro.service.PartnerService;

import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/partners")
public class PartnerController {

	private final PartnerService partnerService;

	@PostMapping("/register")
	public ResponseEntity<?> partnerRegistration(@RequestBody PartnerRegisterDTO partnerRegisterDTO) {
		PartnerResp response = partnerService.registerPartner(partnerRegisterDTO);
		System.out.println(response);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/profile")
	public ResponseEntity<?> getPartnerProfile(Principal principal) {
		String userEmail = principal.getName();
		PartnerProfileResponseDTO response = partnerService.getPartnerProfile(userEmail);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/dashboard/stats")
	public ResponseEntity<?> getPartnerDashboardStats(Principal principal) {
		String userEmail = principal.getName();
		PartnerDashboardStatsDTO response = partnerService.getPartnerDashboardStats(userEmail);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/online-status")
	public ResponseEntity<?> updateOnlineStatus(
			Principal principal,
			@RequestBody PartnerOnlineStatusUpdateDTO dto) {
		String userEmail = principal.getName();
		PartnerOnlineStatusResponseDTO response = partnerService.updateOnlineStatus(userEmail, dto);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/profile")
	public ResponseEntity<?> updatePartnerProfile(
			Principal principal,
			@RequestBody PartnerProfileUpdateDTO dto) {
		String userEmail = principal.getName();
		PartnerProfileResponseDTO response = partnerService.updatePartnerProfile(userEmail, dto);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/profile-photo")
	public ResponseEntity<?> uploadPartnerProfilePhoto(
			Principal principal,
			@RequestPart("file") MultipartFile file) {
		String userEmail = principal.getName();
		ProfilePhotoResponseDTO response = partnerService.uploadPartnerProfilePhoto(userEmail, file);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/profile-photo")
	public ResponseEntity<?> removePartnerProfilePhoto(Principal principal) {
		String userEmail = principal.getName();
		ProfilePhotoResponseDTO response = partnerService.removePartnerProfilePhoto(userEmail);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/available-orders")
	public ResponseEntity<?> getAvailableOrders(Principal principal) {
		String userEmail = principal.getName();
		List<AvailableOrderDTO> orders = partnerService.getAvailableOrders(userEmail);
		return ResponseEntity.ok(orders);
	}

	@GetMapping("/payouts")
	public ResponseEntity<?> getPartnerPayouts(Principal principal) {
		String userEmail = principal.getName();
		List<PartnerPayoutDTO> payouts = partnerService.getPartnerPayouts(userEmail);
		return ResponseEntity.ok(payouts);
	}

	@PostMapping("/transfer-earnings")
	public ResponseEntity<?> transferEarnings(
			Principal principal,
			@RequestBody TransferEarningsRequestDTO dto) {
		String userEmail = principal.getName();
		PartnerPayoutDTO response = partnerService.transferEarnings(userEmail, dto);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/earnings")
	public ResponseEntity<?> getPartnerEarnings(
			Principal principal,
			@RequestParam(value = "period", required = false) String period) {
		String userEmail = principal.getName();
		PartnerEarningsDTO response = partnerService.getPartnerEarnings(userEmail, period);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/accept-order/{shipmentId}")
	public ResponseEntity<?> acceptOrder(
			Principal principal,
			@PathVariable Long shipmentId) {
		String userEmail = principal.getName();
		AcceptedOrderDTO response = partnerService.acceptOrder(userEmail, shipmentId);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/applications")
	public ResponseEntity<List<PartnerApplicationDTO>> getPartnerApplications() {
		List<PartnerApplicationDTO> applications = partnerService.getPendingPartners();
		return ResponseEntity.ok(applications);
	}

	@PutMapping("/approve/{partnerId}")
	public ResponseEntity<PartnerResp> approvePartner(@PathVariable Long partnerId) {
		PartnerResp response = partnerService.approvePartner(partnerId);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/reject/{partnerId}")
	public ResponseEntity<PartnerResp> rejectPartner(@PathVariable Long partnerId) {
		PartnerResp response = partnerService.rejectPartner(partnerId);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/earnings/history")
	public ResponseEntity<?> getEarningsHistory(
			Principal principal,
			@RequestParam(required = false) Timestamp startDate,
			@RequestParam(required = false) Timestamp endDate,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		String userEmail = principal.getName();
		PartnerEarningsHistoryDTO response = partnerService.getEarningsHistory(
				userEmail, startDate, endDate, PageRequest.of(page, size));
		return ResponseEntity.ok(response);
	}
}
