package com.example.ams.controller;

import com.example.ams.dto.MaintenanceDto;
import com.example.ams.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody MaintenanceDto.CreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        try {
            maintenanceService.createRequest(username, request);
            return ResponseEntity.ok("Maintenance request created successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<MaintenanceDto.Response>> getRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        // Simple logic: if admin, show all; if resident, show own. 
        // For now, let's just show own for simplicity or check role if needed.
        // Assuming the service handles filtering or we just return user's requests.
        // Let's return user's requests for now.
        
        return ResponseEntity.ok(maintenanceService.getUserRequests(username));
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<MaintenanceDto.Response>> getAllRequests() {
        return ResponseEntity.ok(maintenanceService.getAllRequests());
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeRequest(@PathVariable String id) {
        maintenanceService.likeRequest(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/dislike")
    public ResponseEntity<?> dislikeRequest(@PathVariable String id) {
        maintenanceService.dislikeRequest(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestParam String status) {
        try {
            System.out.println("Updating status for request " + id + " to " + status);
            maintenanceService.updateStatus(id, status);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error updating status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
