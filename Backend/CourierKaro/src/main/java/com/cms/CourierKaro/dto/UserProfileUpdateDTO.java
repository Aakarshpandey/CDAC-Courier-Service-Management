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
public class UserProfileUpdateDTO {
    
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String profilePhotoUrl;

}
