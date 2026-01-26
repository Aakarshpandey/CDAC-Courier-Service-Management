package com.cms.CourierKaro.service;
import com.cms.CourierKaro.dto.RatingRequestDTO;
import java.util.Map;
public interface RatingService {
    Map<String, Object> submitRating(RatingRequestDTO ratingRequest, String userEmail);
}