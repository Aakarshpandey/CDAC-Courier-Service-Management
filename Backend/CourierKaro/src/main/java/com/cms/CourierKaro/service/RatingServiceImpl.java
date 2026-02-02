package com.cms.CourierKaro.service;
import com.cms.CourierKaro.dto.RatingRequestDTO;
import com.cms.CourierKaro.dto.RatingResponseDTO;
import com.cms.CourierKaro.entity.Partner;
import com.cms.CourierKaro.entity.Rating;
import com.cms.CourierKaro.entity.Shipment;
import com.cms.CourierKaro.entity.User;
import com.cms.CourierKaro.repository.PartnerRepository;
import com.cms.CourierKaro.repository.RatingRepository;
import com.cms.CourierKaro.repository.ShipmentRepository;
import com.cms.CourierKaro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {
    private final RatingRepository ratingRepository;
    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;
    private final PartnerRepository partnerRepository;
    private final ModelMapper modelMapper;
    @Override
    @Transactional
    public Map<String, Object> submitRating(RatingRequestDTO ratingRequest, String userEmail) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate rating value
            if (ratingRequest.getRating() < 1 || ratingRequest.getRating() > 5) {
                response.put("status", "FAILED");
                response.put("message", "Rating must be between 1 and 5");
                return response;
            }
            
            // Get user
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Get shipment
            Shipment shipment = shipmentRepository.findById(ratingRequest.getShipmentId())
                    .orElseThrow(() -> new RuntimeException("Shipment not found"));
            
            // Verify shipment belongs to this customer
            if (!shipment.getCustormerId().getId().equals(user.getId())) {
                response.put("status", "FAILED");
                response.put("message", "You can only rate your own orders");
                return response;
            }
            
            // Verify shipment is delivered
            if (shipment.getStatus() != com.cms.CourierKaro.entity.Status.DELIVERED) {
                response.put("status", "FAILED");
                response.put("message", "You can only rate delivered orders");
                return response;
            }
            
            // Check if rating already exists for this shipment
            Optional<Rating> existingRating = ratingRepository.findByShipmentId_ShipmentId(ratingRequest.getShipmentId());
            if (existingRating.isPresent()) {
                response.put("status", "FAILED");
                response.put("message", "You have already rated this order");
                return response;
            }
            
            // Get partner
            Partner partner = shipment.getPartnerId();
            if (partner == null) {
                response.put("status", "FAILED");
                response.put("message", "No partner assigned to this order");
                return response;
            }
            
            // Create and save rating
            Rating rating = new Rating();
            rating.setShipmentId(shipment);
            rating.setUserId(user);
            rating.setPartnerId(partner);
            rating.setRating(ratingRequest.getRating());
            rating.setReview(ratingRequest.getReview());
            rating.setCreatedAt(LocalDateTime.now());
            
            ratingRepository.save(rating);
            
            // Update partner's average rating
            updatePartnerAverageRating(partner);
            
            response.put("status", "SUCCESS");
            response.put("message", "Rating submitted successfully");
            response.put("ratingId", rating.getRatingId());
            
        } catch (Exception e) {
            response.put("status", "FAILED");
            response.put("message", "Failed to submit rating: " + e.getMessage());
        }
        
        return response;
    }
    
    private void updatePartnerAverageRating(Partner partner) {
        List<Rating> ratings = ratingRepository.findByPartnerId_PartnerId(partner.getPartnerId());
        if (!ratings.isEmpty()) {
            double average = ratings.stream()
                    .mapToInt(Rating::getRating)
                    .average()
                    .orElse(0.0);
            partner.setAvgRating(average);
            partnerRepository.save(partner);
        }
    }
    
    // ... (helper methods)
    @Override
    public Map<String, Object> getPartnerRatings(Long partnerId, int page, int size) {
        Partner partner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        Pageable pageable = PageRequest.of(page, size);
        Page<Rating> ratingPage = ratingRepository.findByPartnerId_PartnerId(partnerId, pageable);
        List<RatingResponseDTO> ratingDTOs = ratingPage.getContent().stream().map(rating -> {
            RatingResponseDTO dto = new RatingResponseDTO();
            dto.setRatingId(rating.getRatingId());
            dto.setRating(rating.getRating());
            dto.setReview(rating.getReview());
            dto.setCreatedAt(rating.getCreatedAt());
            RatingResponseDTO.UserSummaryDTO userDto = new RatingResponseDTO.UserSummaryDTO();
            userDto.setFirstName(rating.getUserId().getFirstName());
            userDto.setLastName(rating.getUserId().getLastName());
            dto.setUser(userDto);
            
            return dto;
        }).collect(Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        response.put("avgRating", partner.getAvgRating());
        response.put("totalRatings", ratingPage.getTotalElements());
        response.put("ratings", ratingDTOs);
        
        return response;
    }
}