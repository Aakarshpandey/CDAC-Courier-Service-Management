package com.cms.CourierKaro.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponse {
	
	private String status;
	private String message;
	private LocalDateTime timeStamp;
	public ApiResponse(String status, String message) {
		this.status = status;
		this.message = message;
		this.timeStamp =LocalDateTime.now();
	}
}