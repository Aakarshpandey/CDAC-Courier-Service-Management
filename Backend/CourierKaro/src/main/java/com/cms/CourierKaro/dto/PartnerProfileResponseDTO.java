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
public class PartnerProfileResponseDTO {
	private Long partnerId;
	private Long userId;
	private String firstName;
	private String lastName;
	private String email;
	private String phoneNumber;
	private String profilePhotoUrl;
	private String vehicleTypeName;
	private String vehicleRegNumber;
	private String vehicleModel;
	private String drivingLicenseNumber;
	private String driverAddress;
	private Integer pincode;
	private String preferredCity;
	private String panNumber;
	private Long bankAccountNumber;
	private Long aadharNumber;
	private Boolean validInsurance;
	private Boolean isApproved;
	private Boolean isOnline;
	private Double avgRating;
	private String status;
	private String message;
	private String responseStatus;
}
