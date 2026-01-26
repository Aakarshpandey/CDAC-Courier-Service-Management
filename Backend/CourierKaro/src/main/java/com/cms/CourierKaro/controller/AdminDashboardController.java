package com.cms.CourierKaro.controller;
import com.cms.CourierKaro.dto.AdminStatsDTO;
import com.cms.CourierKaro.entity.PartnerStatus;
import com.cms.CourierKaro.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final AdminDashboardService adminDashboardService;
    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminStatsDTO> getDashboardStats() {
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
}