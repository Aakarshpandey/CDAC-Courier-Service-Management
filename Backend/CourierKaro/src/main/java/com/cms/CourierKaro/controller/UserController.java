package com.cms.CourierKaro.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cms.CourierKaro.dto.UserPasswordChangeDTO;
import com.cms.CourierKaro.dto.UserProfileResponseDTO;
import com.cms.CourierKaro.dto.UserProfileUpdateDTO;
import com.cms.CourierKaro.response.UserResp;
import com.cms.CourierKaro.service.UserService;

import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@GetMapping("/profile")
	public ResponseEntity<?> getUserProfile(Principal principal) {
		String userEmail = principal.getName();
		UserProfileResponseDTO response = userService.getUserProfile(userEmail);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/profile")
	public ResponseEntity<?> updateUserProfile(Principal principal, @RequestBody UserProfileUpdateDTO dto) {
		String userEmail = principal.getName();
		UserProfileResponseDTO response = userService.updateUserProfile(userEmail, dto);
		return ResponseEntity.ok(response);
	}
	
	@PutMapping("/password")
	public ResponseEntity<?> changePassword(Principal principal, @RequestBody UserPasswordChangeDTO dto) {
		String userEmail = principal.getName();
		UserResp response = userService.changePassword(userEmail, dto);
		return ResponseEntity.ok(response);
	}

}
