package com.cms.CourierKaro.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cms.CourierKaro.dto.UserLoginDTO;
import com.cms.CourierKaro.dto.UserRegisterDTO;
import com.cms.CourierKaro.response.LoginResponse;
import com.cms.CourierKaro.response.UserResp;
import com.cms.CourierKaro.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequiredArgsConstructor
public class AuthController {
	
	private final UserService userService;
	
	@PostMapping("/register")
	public ResponseEntity<?> userRegistration(@RequestBody UserRegisterDTO userRegisterDTO){
		UserResp response = userService.registerUser(userRegisterDTO);
		System.out.println(response);
		return ResponseEntity.ok(response);
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> userLogin(@RequestBody UserLoginDTO userLoginDTO, HttpServletResponse httpResponse){
		LoginResponse response = userService.login(userLoginDTO);
		System.out.println(response);

		if ("SUCCESS".equals(response.getStatus()) && response.getToken() != null) {
			Cookie cookie = new Cookie("jwt", response.getToken());
			cookie.setHttpOnly(true);
			cookie.setPath("/");
			cookie.setMaxAge(userLoginDTO.isRememberMe() ? 7 * 24 * 60 * 60 : 24 * 60 * 60);
			httpResponse.addCookie(cookie);
		}

		return ResponseEntity.ok(response);
	}
}