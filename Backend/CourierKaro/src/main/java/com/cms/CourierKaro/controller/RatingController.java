package com.cms.CourierKaro.controller;
import com.cms.CourierKaro.dto.RatingRequestDTO;
import com.cms.CourierKaro.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("/api") // Note: Prefix changed to match requirements /api/partners/.../ratings
@RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;
    @PostMapping("/ratings")
    public ResponseEntity<Map<String, Object>> submitRating(@RequestBody RatingRequestDTO ratingRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
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
}