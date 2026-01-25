package com.cms.CourierKaro.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentRequestDTO {
    private String userEmail;
    private LocationDTO pickupLocation;
    private LocationDTO deliveryLocation;
    private String packageType;
    private Double weight;
    private String vehicleType;
}
