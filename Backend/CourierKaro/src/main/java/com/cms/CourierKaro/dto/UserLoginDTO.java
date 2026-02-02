package com.cms.CourierKaro.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@ToString
public class UserLoginDTO {
	private String email;
	private String password;
	private String loginType;
	private boolean rememberMe;
}
