package com.cms.CourierKaro.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ErrorResponse {
    
    private String status;
    private String message;
    private LocalDateTime timestamp;
    private String path;
    
    public ErrorResponse(String message) {
        this.status = "ERROR";
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
}