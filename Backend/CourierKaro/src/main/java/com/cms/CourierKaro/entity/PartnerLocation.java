package com.cms.CourierKaro.entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="PARTNER_LOCATIONS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartnerLocation {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Location locationId;
	
	@JoinColumn(name = "partner_id")
	private Partner partner;
	
	private Double lat;
	
	private Double lng;
	
	@Column(name="is_online")
	private boolean isOnline;
	
	private Timestamp timestamp;	
	
}
