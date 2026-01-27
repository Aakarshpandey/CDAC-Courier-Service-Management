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
        // ... (previous implementation)
        return new HashMap<>(); // Placeholder to keep compiler happy if you copy paste
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