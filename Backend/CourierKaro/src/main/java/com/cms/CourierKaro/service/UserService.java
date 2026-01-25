package com.cms.CourierKaro.service;

import com.cms.CourierKaro.dto.UserLoginDTO;
import com.cms.CourierKaro.dto.UserProfileResponseDTO;
import com.cms.CourierKaro.dto.UserRegisterDTO;
import com.cms.CourierKaro.response.LoginResponse;
import com.cms.CourierKaro.response.UserResp;

public interface UserService {
	UserResp registerUser(UserRegisterDTO dto);
	 LoginResponse login(UserLoginDTO dto);
	UserProfileResponseDTO getUserProfile(String userEmail);
}
