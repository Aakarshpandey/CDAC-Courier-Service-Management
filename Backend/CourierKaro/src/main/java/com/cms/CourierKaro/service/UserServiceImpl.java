package com.cms.CourierKaro.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cms.CourierKaro.dto.UserRegisterDTO;
import com.cms.CourierKaro.entity.User;
import com.cms.CourierKaro.repository.UserRepository;
import com.cms.CourierKaro.response.UserResp;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

	private final UserRepository userRepository;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;

	@Override
	public UserResp registerUser(UserRegisterDTO dto) {
		
		//validate password
		if(!dto.getPassword().equals(dto.getConfirmPassword())) {
			return new UserResp("Password does not match", "FAILED");
		}
		//email check
		System.out.println(dto.getEmail());
		System.out.println(userRepository.existsByEmail(dto.getEmail()));
		if(userRepository.existsByEmail(dto.getEmail())) {
			return new UserResp("Email already exists", "Email_Exist");
		}
		User user = modelMapper.map(dto, User.class);
		
		//encode password
		user.setPassword(passwordEncoder.encode(dto.getPassword()));
		
		userRepository.save(user);
		
		return new UserResp("User registered successfully", "SUCCESS");
		
	}
}
