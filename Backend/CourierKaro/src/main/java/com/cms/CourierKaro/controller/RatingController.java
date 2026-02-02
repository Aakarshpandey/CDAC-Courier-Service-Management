package com.cms.CourierKaro.controller;
import com.cms.CourierKaro.dto.RatingRequestDTO;
import com.cms.CourierKaro.service.RatingService;
import com.cms.CourierKaro.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;
    private final JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/ratings")
    public ResponseEntity<Map<String, Object>> submitRating(
            Principal principal,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestBody RatingRequestDTO ratingRequest) {
        String userEmail = resolveEmail(principal, authorizationHeader);
        if (userEmail == null) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "FAILED",
                "message", "Authentication required"
            ));
        }
        
        Map<String, Object> response = ratingService.submitRating(ratingRequest, userEmail);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/partners/{partnerId}/ratings")
    public ResponseEntity<Map<String, Object>> getPartnerRatings(
            @PathVariable Long partnerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Map<String, Object> response = ratingService.getPartnerRatings(partnerId, page, size);
        return ResponseEntity.ok(response);
    }
    
    private String resolveEmail(Principal principal, String authorizationHeader) {
        if (principal != null) {
            return principal.getName();
        }
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            return null;
        }
        String prefix = "Bearer ";
        if (!authorizationHeader.startsWith(prefix)) {
            return null;
        }
        String token = authorizationHeader.substring(prefix.length()).trim();
        if (token.isEmpty()) {
            return null;
        }
        if (!jwtTokenProvider.validateToken(token)) {
            return null;
        }
        return jwtTokenProvider.getEmailFromToken(token);
    }
}