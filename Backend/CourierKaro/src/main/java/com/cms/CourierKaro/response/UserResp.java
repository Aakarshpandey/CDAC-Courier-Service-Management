package com.cms.CourierKaro.response;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UserResp {
	private String message;
	private String status;
	private Timestamp timestamp;
	
	public UserResp(String message, String status) {
		this.message = message;
		this.status = status;
	}
}
