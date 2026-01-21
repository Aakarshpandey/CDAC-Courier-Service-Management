	package com.cms.CourierKaro.entity;
	
	import jakarta.persistence.Column;
	import jakarta.persistence.Entity;
	import jakarta.persistence.GeneratedValue;
	import jakarta.persistence.GenerationType;
	import jakarta.persistence.Id;
	import jakarta.persistence.JoinColumn;
	import jakarta.persistence.OneToOne;
	import jakarta.persistence.Table;
	import lombok.AllArgsConstructor;
	import lombok.Getter;
	import lombok.NoArgsConstructor;
	import lombok.Setter;
	
	@Entity
	@Table(name = "partners")
	@Getter
	@Setter
	@NoArgsConstructor
	@AllArgsConstructor
	public class Partner {
		@Id
		@GeneratedValue(strategy = GenerationType.IDENTITY)
		private Long partnerId;
		
		@OneToOne
		@JoinColumn(name = "user_id", nullable = false)
		private User userId;
		
		@Column(name="vehicle_type_id")
		private Long vehicleTypeId;
		
		@Column(name = "vehicle_reg_number")
		private String vehicleRegNumber;
		
		@Column(name="vehicle_model")
		private String vehicleModel;
		
		@Column(name="driver_license_number")
		private String drivingLiscenseNumber;
		
		@Column(name="driver_address")
		private String driverAddress;
		
		private int pincode;
		
		@Column(name="preferred_city")
		private String preferredCity;
		
		@Column(name="pan_number")
		private String panNumber;
		
		@Column(name="bank_account_number")
		private Long bankAccountNumber;
		
		@Column(name="aadhar_number")
		private Long aadharNumber;
		
		@Column(name="valid_insurance")
		private boolean validInsurance;
		
		@Column(name="is_approved")
		private boolean isApproved;
		
		@Column(name="is_online")
		private boolean isOnline;
		
		@Column(name="avg_rating")
		private double avgRating;
		
		private Status status;
	}
