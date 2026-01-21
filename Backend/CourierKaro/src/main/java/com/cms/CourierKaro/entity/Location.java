package com.cms.CourierKaro.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@Table(name="locations")
public class Location {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="location_id")
	private Long id;
	
	@Column(length=100)
	private String city;
	
	@Column(length=6)
	private String pincode;
	
	@Column(precision = 11, scale = 8)
	private Double lat;
	@Column(precision = 11, scale = 8)
	private Double lng;
	
	
}
