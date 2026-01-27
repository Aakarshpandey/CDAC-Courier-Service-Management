package com.cms.CourierKaro.dto;
import lombok.Data;
@Data
public class RatingRequestDTO {
    private Long shipmentId;
    private Long partnerId;
    private int rating;
    private String review;
}