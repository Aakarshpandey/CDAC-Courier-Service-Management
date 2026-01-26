package com.cms.CourierKaro.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class RatingResponseDTO {
    private Long ratingId;
    private UserSummaryDTO user;
    private int rating;
    private String review;
    private LocalDateTime createdAt;
    
    @Data
    public static class UserSummaryDTO {
        private String firstName;
        private String lastName;
    }
}