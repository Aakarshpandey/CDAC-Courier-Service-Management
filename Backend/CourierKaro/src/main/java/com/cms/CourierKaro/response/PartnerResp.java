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
public class PartnerResp {
	private String message;
	private String status;
	private Long userId;
	private Long partnerId;
	private Timestamp timestamp;

	public PartnerResp(String message, String status) {
		this.message = message;
		this.status = status;
	}

	public PartnerResp(String message, String status, Long userId, Long partnerId) {
		this.message = message;
		this.status = status;
		this.userId = userId;
		this.partnerId = partnerId;
	}
}

