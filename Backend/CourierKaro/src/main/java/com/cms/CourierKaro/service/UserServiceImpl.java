package com.cms.CourierKaro.service;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.cms.CourierKaro.dto.UserLoginDTO;
import com.cms.CourierKaro.dto.UserProfileResponseDTO;
import com.cms.CourierKaro.dto.UserProfileUpdateDTO;
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
	// private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;

	@Override
	public UserResp registerUser(UserRegisterDTO dto) {

		if (!dto.getPassword().equals(dto.getConfirmPassword())) {
			return new UserResp("Password does not match", "FAILED");
		}

		Role role = Role.ROLE_USER;

		if (userRepository.existsByEmailAndRole(dto.getEmail(), role)) {
			return new UserResp("Email already registered", "EMAIL_EXIST");
		}

		User user = modelMapper.map(dto, User.class);
		// user.setPassword(passwordEncoder.encode(dto.getPassword()));
		user.setPassword(dto.getPassword());
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
					"FAILED");
		}

		User user = userRepository.findByEmailAndRole(dto.getEmail(), role)
				.orElse(null);

		if (user == null) {
			return new LoginResponse(
					null, null, null, null, null,
					"Invalid credentials",
					"FAILED");
		}

		// if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
		// return new LoginResponse(
		// null, null, null, null, null,
		// "Invalid credentials",
		// "FAILED"
		// );
		// }

		String token = jwtTokenProvider.generateToken(
				user.getEmail(),
				user.getRole().name(),
				dto.isRememberMe());

		return new LoginResponse(
				token,
				user.getEmail(),
				user.getFirstName(),
				user.getLastName(),
				user.getRole().toString(),
				"Login successful",
				"SUCCESS");
	}

	@Override
	public UserProfileResponseDTO getUserProfile(String userEmail) {
		try {
			User user = userRepository.findByEmail(userEmail).orElse(null);
			if (user == null) {
				return UserProfileResponseDTO.builder().message("User Loading Failed").status("FAILED").build();
			}

			UserProfileResponseDTO response = modelMapper.map(user, UserProfileResponseDTO.class);
			response.setMessage("User Loaded Succesfully");
			response.setStatus("SUCCESS");
			return response;
		} catch (Exception e) {
			return UserProfileResponseDTO.builder().message(e.getMessage()).status("FAILED").build();
		}

	}

	@Override
	public UserProfileResponseDTO updateUserProfile(String userEmail, UserProfileUpdateDTO dto) {
		try {
			User user = userRepository.findByEmail(userEmail).orElse(null);
			if (user == null) {
				return UserProfileResponseDTO.builder().message("User Not Found").status("FAILED").build();
			}

			if (dto.getFirstName() != null)
				user.setFirstName(dto.getFirstName());
			if (dto.getLastName() != null)
				user.setLastName(dto.getLastName());
			if (dto.getPhoneNumber() != null)
				user.setPhoneNumber(dto.getPhoneNumber());
			if (dto.getProfilePhotoUrl() != null)
				user.setProfilePhotoUrl(dto.getProfilePhotoUrl());

			User updatedUser = userRepository.save(user);

			UserProfileResponseDTO response = modelMapper.map(updatedUser, UserProfileResponseDTO.class);
			response.setMessage("Profile updated");
			response.setStatus("SUCCESS");
			return response;
		} catch (Exception e) {
			return UserProfileResponseDTO.builder().message(e.getMessage()).status("FAILED").build();
		}
	}
	
	@Override
	public com.cms.CourierKaro.response.UserResp changePassword(String userEmail, com.cms.CourierKaro.dto.UserPasswordChangeDTO dto) {
		try {
			User user = userRepository.findByEmail(userEmail).orElse(null);
			if (user == null) {
				return new com.cms.CourierKaro.response.UserResp("User not found", "FAILED");
			}

			// Verify current password
			if (!user.getPassword().equals(dto.getCurrentPassword())) {
				return new com.cms.CourierKaro.response.UserResp("Incorrect current password", "FAILED");
			}

			// Update to new password
			user.setPassword(dto.getNewPassword());
			userRepository.save(user);

			return new com.cms.CourierKaro.response.UserResp("Password changed successfully", "SUCCESS");
		} catch (Exception e) {
			return new com.cms.CourierKaro.response.UserResp("Failed to change password: " + e.getMessage(), "FAILED");
		}
	}

}
