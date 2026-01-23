package com.cms.CourierKaro.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.cms.CourierKaro.dto.UserLoginDTO;
import com.cms.CourierKaro.dto.UserRegisterDTO;
import com.cms.CourierKaro.entity.Role;
import com.cms.CourierKaro.entity.User;
import com.cms.CourierKaro.repository.UserRepository;
import com.cms.CourierKaro.response.LoginResponse;
import com.cms.CourierKaro.response.UserResp;
import com.cms.CourierKaro.security.JwtTokenProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	
	private final UserRepository userRepository;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;
	
	@Override
	public UserResp registerUser(UserRegisterDTO dto) {
		
		if(!dto.getPassword().equals(dto.getConfirmPassword())) {
			return new UserResp("Password does not match", "FAILED");
		}
		
		Role role = Role.ROLE_USER;
		
		if(userRepository.existsByEmailAndRole(dto.getEmail(), role)) {
			return new UserResp("Email already registered", "EMAIL_EXIST");
		}
		
		User user = modelMapper.map(dto, User.class);
		user.setPassword(passwordEncoder.encode(dto.getPassword()));
		user.setRole(role);
		
		userRepository.save(user);
		
		return new UserResp("User registered successfully", "SUCCESS");
	}
	
	@Override
	public LoginResponse login(UserLoginDTO dto) {
		
		Role role;
		try {
			role = Role.valueOf(dto.getLoginType().toUpperCase());
		} catch (IllegalArgumentException e) {
			return new LoginResponse(
				null, null, null, null, null, 
				"Invalid login type. Must be USER or PARTNER", 
				"FAILED"
			);
		}
		
		User user = userRepository.findByEmailAndRole(dto.getEmail(), role)
			.orElse(null);
		
		if (user == null) {
			return new LoginResponse(
				null, null, null, null, null, 
				"Invalid credentials", 
				"FAILED"
			);
		}
		
		if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
			return new LoginResponse(
				null, null, null, null, null, 
				"Invalid credentials", 
				"FAILED"
			);
		}
		
		String token = jwtTokenProvider.generateToken(
			user.getEmail(), 
			user.getRole().name(),
			dto.isRememberMe()
		);
		
		return new LoginResponse(
			token,
			user.getEmail(),
			user.getFirstName(),
			user.getLastName(),
			user.getRole().toString(),
			"Login successful",
			"SUCCESS"
		);
	}
}