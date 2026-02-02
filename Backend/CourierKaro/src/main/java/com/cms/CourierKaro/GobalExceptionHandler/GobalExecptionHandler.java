package com.cms.CourierKaro.GobalExceptionHandler;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;


import com.cms.CourierKaro.exception.BadRequestException;
import com.cms.CourierKaro.exception.ConflictException;
import com.cms.CourierKaro.exception.ForbiddenException;
import com.cms.CourierKaro.exception.InternalServerException;
import com.cms.CourierKaro.exception.ResourceNotFoundException;
import com.cms.CourierKaro.exception.UnauthorizedException;
import com.cms.CourierKaro.dto.ApiResponse;
import com.cms.CourierKaro.dto.ErrorResponse;

@RestControllerAdvice
public class GobalExecptionHandler {
	
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleResourceNotFoundExcettion(ResourceNotFoundException ex, WebRequest request) {
		
		ErrorResponse errorResponse = ErrorResponse.builder()
				.status("FAILED")
				.message(ex.getMessage())
				.timestamp(LocalDateTime.now())
				.path(request.getDescription(false).replace("uri=", ""))
				.build();
		
		return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
	}
	
	@ExceptionHandler(UnauthorizedException.class)
	public ResponseEntity<ErrorResponse> handleUnauthorizedException(UnauthorizedException ex, WebRequest request) {
		
		ErrorResponse errorResponse = ErrorResponse.builder()
				.status("FAILED")
				.message(ex.getMessage())
				.path(request.getDescription(false).replace("uri=", ""))
				.timestamp(LocalDateTime.now())
				.build();
		
		return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
	}
	
	@ExceptionHandler(ForbiddenException.class)
	public ResponseEntity<ErrorResponse> handleForbiddenException(ForbiddenException ex, WebRequest request){
		ErrorResponse errorResponse = ErrorResponse.builder()
				.status("FAILED")
				.message(ex.getMessage())
				.path(request.getDescription(false).replace("uri=", ""))
				.build();
		
		return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
	}
	
	
	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<ErrorResponse> handlerBadRequestException(BadRequestException ex, WebRequest request){
		ErrorResponse errorResponse = ErrorResponse.builder()
				.status("FAILED")
				.message(ex.getMessage())
				.path(request.getDescription(false).replace("uri=", ""))
				.timestamp(LocalDateTime.now())
				.build();
		return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
	}
	
	
	public ResponseEntity<ErrorResponse> handlerConflictException(ConflictException ex, WebRequest request){
		ErrorResponse errorResponse = ErrorResponse.builder()
				.status("FAILED")
				.message(ex.getMessage())
				.path(request.getDescription(false).replace("uri=", ""))
				.timestamp(LocalDateTime.now())
				.build();
		
		return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
	}
 	
	
	  @ExceptionHandler(InternalServerException.class)
	  public ResponseEntity<ErrorResponse> handleInternalServerException(
	            InternalServerException ex, WebRequest request) {
	        
	        ErrorResponse errorResponse = ErrorResponse.builder()
	                .status("FAILED")
	                .message(ex.getMessage())
	                .timestamp(LocalDateTime.now())
	                .path(request.getDescription(false).replace("uri=", ""))
	                .build();
	        
	        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	
	
	@ExceptionHandler(RuntimeException.class)
	ResponseEntity<?> handleRuntimeExcaption(RuntimeException e){
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse("Error", e.getMessage()));
	}
	
	
	
	 /**
     * Handle all other exceptions - 500 INTERNAL SERVER ERROR
     * Catch-all for unexpected errors
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex, WebRequest request) {
        
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status("FAILED")
                .message("An unexpected error occurred. Please try again later.")
                .timestamp(LocalDateTime.now())
                .path(request.getDescription(false).replace("uri=", ""))
                .build();
        
        // Log the actual exception for debugging
        ex.printStackTrace();
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
	
}
