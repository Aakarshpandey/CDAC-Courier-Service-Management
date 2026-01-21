package com.cms.CourierKaro.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "shipment_tracking")
public class ShipmentTracking {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tracking_id")
	private Long trackingId;
	
	@OneToOne
	@JoinColumn(name = "shipment_id")
	private Shipment shipmentId;
	
	@Enumerated(EnumType.STRING)
	private Status status;
	
	private String location;
	
	@Column(columnDefinition = "TEXT")
	private String notes;
	
	@Column(name = "timestamp")
	private LocalDateTime timeStamp;
	
}
