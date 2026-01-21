package com.cms.CourierKaro.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cms.CourierKaro.dto.UserRegisterDTO;
import com.cms.CourierKaro.response.UserResp;
import com.cms.CourierKaro.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AuthController {
	
	private final UserService userService;
	
	@PostMapping("/register")
	public ResponseEntity<?> userRegistration(@RequestBody UserRegisterDTO userRegisterDTO){
		UserResp response = userService.registerUser(userRegisterDTO);
		return ResponseEntity.ok(response);
	}
}
