package com.cms.CourierKaro.dto;

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
public class PartnerOnlineStatusResponseDTO {
	private String status;
	private String message;
	private Boolean isOnline;
}

