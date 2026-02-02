package com.cms.CourierKaro.exception;

public class BadRequestException extends RuntimeException {
    
    public BadRequestException(String message) {
        super(message);
    }
    
    public BadRequestException() {
        super("Invalid request data");
    }
}