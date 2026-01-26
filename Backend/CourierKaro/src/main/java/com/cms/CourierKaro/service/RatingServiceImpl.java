package com.cms.CourierKaro.service;
import com.cms.CourierKaro.dto.RatingRequestDTO;
import com.cms.CourierKaro.entity.Partner;
import com.cms.CourierKaro.entity.Rating;
import com.cms.CourierKaro.entity.Shipment;
import com.cms.CourierKaro.entity.User;
import com.cms.CourierKaro.repository.PartnerRepository;
import com.cms.CourierKaro.repository.RatingRepository;
import com.cms.CourierKaro.repository.ShipmentRepository;
import com.cms.CourierKaro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {
    private final RatingRepository ratingRepository;
    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;
    private final PartnerRepository partnerRepository;
    @Override
    @Transactional
    public Map<String, Object> submitRating(RatingRequestDTO ratingRequest, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Shipment shipment = shipmentRepository.findById(ratingRequest.getShipmentId())
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
        Partner partner = partnerRepository.findById(ratingRequest.getPartnerId())
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        
        // TODO: specific validation if needed (e.g. check if user owns shipment)
        Rating rating = new Rating();
        rating.setShipmentId(shipment);
        rating.setUserId(user);
        rating.setPartnerId(partner);
        rating.setRating(ratingRequest.getRating());
        rating.setReview(ratingRequest.getReview());
        rating.setCreatedAt(LocalDateTime.now());
        Rating savedRating = ratingRepository.save(rating);
        
        // Update partner average rating
        updatePartnerAvgRating(partner);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Rating submitted");
        response.put("ratingId", savedRating.getRatingId());
        return response;
    }
    private void updatePartnerAvgRating(Partner partner) {
        List<Rating> ratings = ratingRepository.findByPartnerId_PartnerId(partner.getPartnerId());
        double avg = ratings.stream().mapToInt(Rating::getRating).average().orElse(0.0);
        partner.setAvgRating(avg);
        partnerRepository.save(partner);
    }
}