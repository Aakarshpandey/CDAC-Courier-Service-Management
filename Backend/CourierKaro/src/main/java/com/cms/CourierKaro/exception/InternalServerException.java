package com.cms.CourierKaro.exception;

public class InternalServerException extends RuntimeException {
    
    public InternalServerException(String message) {
        super(message);
    }
    
    public InternalServerException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public InternalServerException() {
        super("An unexpected error occurred. Please try again later");
    }
}