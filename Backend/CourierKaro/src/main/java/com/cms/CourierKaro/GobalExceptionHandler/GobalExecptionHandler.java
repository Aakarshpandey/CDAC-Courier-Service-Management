package com.cms.CourierKaro.GobalExceptionHandler;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.cms.CourierKaro.dto.ApiResponse;

@RestControllerAdvice
public class GobalExecptionHandler {
	
	@ExceptionHandler(RuntimeException.class)
	ResponseEntity<?> handleRuntimeExcaption(RuntimeException e){
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Error", e.getMessage()));
	}
	
}
