package com.cms.CourierKaro.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartnerRegisterDTO {
	// User fields
	private String firstName;
	private String lastName;
	private String email;
	private String phoneNumber;
	private String password;
	private String confirmPassword;

	// Partner fields
	private Long vehicleTypeId;
	/**
	 * Optional alternative to {@code vehicleTypeId}. If provided, backend will try to
	 * resolve the vehicle type by name (case-insensitive).
	 */
	private String vehicleTypeName;
	private String vehicleRegNumber;
	private String vehicleModel;
	private String drivingLiscenseNumber;
	private String driverAddress;
	private Integer pincode;
	private String preferredCity;
	private String panNumber;
	private Long bankAccountNumber;
	private Long aadharNumber;
	private Boolean validInsurance;
}

