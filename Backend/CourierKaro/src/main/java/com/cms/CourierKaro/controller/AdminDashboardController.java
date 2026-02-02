package com.cms.CourierKaro.controller;
import com.cms.CourierKaro.dto.AdminStatsDTO;
import com.cms.CourierKaro.dto.PartnerApprovalDTO;
import com.cms.CourierKaro.entity.PartnerStatus;
import com.cms.CourierKaro.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
@RestController
@CrossOrigin
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final AdminDashboardService adminDashboardService;
    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminStatsDTO> getDashboardStats() {
    	System.out.println(adminDashboardService.getDashboardStats());
        return ResponseEntity.ok(adminDashboardService.getDashboardStats());
    }
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminDashboardService.getAllUsers(search, page, size));
    }
    
    @GetMapping("/partners")
    public ResponseEntity<Map<String, Object>> getAllPartners(
            @RequestParam(required = false) PartnerStatus status,
            @RequestParam(required = false) Boolean isApproved,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminDashboardService.getAllPartners(status, isApproved, page, size));
    }
    
    @PutMapping("/partners/{partnerId}/approval")
    public ResponseEntity<Map<String, String>> approvePartner(
            @PathVariable Long partnerId,
            @RequestBody PartnerApprovalDTO approvalDto) {
        
        adminDashboardService.updatePartnerApproval(partnerId, approvalDto);
        return ResponseEntity.ok(Collections.singletonMap("message", "Partner approval status updated"));
    }
}