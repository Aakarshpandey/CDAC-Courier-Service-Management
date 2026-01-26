package com.cms.CourierKaro.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartnerProfileUpdateDTO {
	// User fields (editable)
	private String firstName;
	private String lastName;
	private String phoneNumber;

	// Partner fields (editable)
	private String vehicleModel;
	private String driverAddress;
	private Integer pincode;
	private String preferredCity;
	private Long bankAccountNumber;

	// NOTE: vehicleRegNumber is intentionally NOT included (cannot be changed)
}

