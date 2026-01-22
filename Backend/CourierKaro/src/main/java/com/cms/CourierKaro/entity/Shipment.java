package com.cms.CourierKaro.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name ="shipments")
public class Shipment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "shipment_id")
	private Long shipmentId;
	
	@ManyToOne
	@JoinColumn(name = "customer_id")
	private User custormerId;
	
	@ManyToOne
	@JoinColumn(name = "partner_id")
	private Partner partnerId;
	
	@ManyToOne
	@JoinColumn(name = "vehicle_type_id")
	private VehicleType vehicleTypeId;
	
	@Column(length = 100, name = "vehicle_model")
	private String vehicleModel;
	
	@OneToOne
	@JoinColumn(name = "pickup_location_id")
	private Location pickupLocationId;
	
	@OneToOne
	@JoinColumn(name = "delivery_location_id")
	private Location deliveryLocationId;
	
	@Enumerated(EnumType.STRING)
	private PackageType packageType;
	
	@Column(name = "package_description", columnDefinition = "TEXT")
	private String packageDescription;
	
	@Column(name = "weight_Kg",precision = 10, scale = 2)
	private BigDecimal weightKg	;
	@Column(name = "declared_value",precision = 10, scale = 2)
	private BigDecimal declaredValue;
	
	//pickup details
	@Column(name = "pickup_address", columnDefinition = "TEXT")
	private String pickupAddress;
	
	@Column(name = "pickup_landmark")
	private String pickupLandmark;
	
	@Column(name = "pickup_contact_name", length = 100)
	private String pickupContactName;
	
	@Column(name = "pickup_phone", length = 15)
	private String pickupPhone;
	
	
	//delivery details
	@Column(name = "delivery_address", columnDefinition = "TEXT")
	private String deliveryAddress;
	
	@Column(name = "delivery_landmark")
	private String deliveryLandmark;
	
	@Column(name = "delivery_contact_name",length = 100)
	private String deliveryContactName;
	
	@Column(name="delivery_phone", length = 15)
	private String deliveryPhone;
	
	//package related
	@Column(name = "distance_km",precision = 10, scale = 2)
	private BigDecimal distanceKm;
	
	@Column(name = "calculated_price",precision = 10, scale = 2)
	private BigDecimal calculatedPrice;
	
	@Enumerated(EnumType.STRING)
	private Status status; 
	
	@Enumerated(EnumType.STRING)
	@Column(name = "payment_status")
	private PaymentStatus paymentStatus;
	
	@CreationTimestamp
	@Column(name = "created_at")
	private LocalDateTime createdAt;
	
	@Column(name = "picked_up_at")
	private LocalDateTime pickedUpAt;
	
	@Column(name = "delivered_at")
	private LocalDateTime deliveredAt;
	
}














