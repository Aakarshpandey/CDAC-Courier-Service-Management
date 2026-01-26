package com.cms.CourierKaro.dto;

import com.cms.CourierKaro.entity.PartnerStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO for returning partner application details to the frontend.
 * Used in the Admin Dashboard to display pending partner applications.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartnerApplicationDTO {
	
	private Long partnerId;
	private PartnerStatus status;
	
	// Vehicle information
	private String vehicleRegNumber;
	private String vehicleModel;
	
	// Driver information
	private String drivingLiscenseNumber;
	private String driverAddress;
	private int pincode;
	private String preferredCity;
	
	// Documents
	private String panNumber;
	private Long bankAccountNumber;
	private Long aadharNumber;
	
	// Additional info
	private boolean validInsurance;
	private boolean isApproved;
	private boolean isOnline;
	private double avgRating;
	
	// Nested user information
	private UserInfoDTO userId;
	
	// Nested vehicle type information
	private VehicleTypeInfoDTO vehicleTypeId;
	
	/**
	 * Nested DTO for user information
	 */
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	public static class UserInfoDTO {
		private Long id;
		private String firstName;
		private String lastName;
		private String email;
		private String phoneNumber;
	}
	
	/**
	 * Nested DTO for vehicle type information
	 */
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	public static class VehicleTypeInfoDTO {
		private Long vehicleTypeId;
		private String typeName;
	}
}
