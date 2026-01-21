package com.cms.CourierKaro.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
	@Column(name="vehicle_type_id")
	private Long id;
	
	@Column(name="type_name", length=100)
	private String typeName;
	
	@Column(name ="base_fare",precision = 10, scale = 2)
	private Double baseFare;
	
	
	@Column(name ="base_fare",precision = 10, scale = 2)
	private Double perKmRate;
	
	@Column(name ="max_weight_kg",precision = 10, scale = 2)
	private Double maxWeigthKg;
}
