package com.cms.CourierKaro.entity;

import java.math.BigDecimal;

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
@Table(name="vehicle_types")	
public class VehicleType {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="vehicle_type_id")
	private Long id;
	
	@Column(name="type_name", length=100)
	private String typeName;
	
	@Column(name ="base_fare")
	private BigDecimal baseFare;
	
	
	@Column(name ="per_km_rate")
	private BigDecimal perKmRate;
	
	@Column(name ="max_weight_kg")
	private BigDecimal maxWeigthKg;
}
