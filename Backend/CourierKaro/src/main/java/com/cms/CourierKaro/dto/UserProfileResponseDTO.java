package com.cms.CourierKaro.dto;

import java.time.LocalDateTime;

import com.cms.CourierKaro.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponseDTO {
	
	private Long userId;
	private String message;
	private String status;
	private String email;
	private String firstName;
	private String lastName;
	private String phoneNumber;
	private String profilePhotoUrl;
	private Role role;
	private LocalDateTime createdAt;
	
}
