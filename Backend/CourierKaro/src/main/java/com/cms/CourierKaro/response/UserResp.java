package com.cms.CourierKaro.response;

import java.sql.Timestamp;

public class UserResp {
	private String message;
	private String status;
	private Timestamp timestamp;
	
	public UserResp(String message, String status) {
		this.message = message;
		this.status = status;
	}
}
