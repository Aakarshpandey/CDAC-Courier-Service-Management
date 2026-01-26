package com.cms.CourierKaro.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.CourierKaro.dto.PartnerRegisterDTO;
import com.cms.CourierKaro.response.PartnerResp;
import com.cms.CourierKaro.service.PartnerService;

import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/partner")
public class PartnerController {

	private final PartnerService partnerService;

	@PostMapping("/register")
	public ResponseEntity<?> partnerRegistration(@RequestBody PartnerRegisterDTO partnerRegisterDTO) {
		PartnerResp response = partnerService.registerPartner(partnerRegisterDTO);
		System.out.println(response);
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/applications")
	public ResponseEntity<?> getPartnerApplications(){
		
	}
	
	
}

