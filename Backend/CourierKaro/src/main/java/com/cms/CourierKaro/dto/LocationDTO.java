package com.cms.CourierKaro.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LocationDTO {
    private String fullAddress;
    private String contactName;
    private String phoneNo;
    private String pincode;
}
