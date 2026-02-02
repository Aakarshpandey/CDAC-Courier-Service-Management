package com.cms.CourierKaro.exception;

public class UnauthorizedException 	extends RuntimeException{
	
	public UnauthorizedException(String message) {
		super(message);
	}
	
	public UnauthorizedException() {
        super("Authentication required or invalid credentials");
    }
}
