package com.example.ams.controller;

import com.example.ams.model.User;
import com.example.ams.model.Apartment;
import com.example.ams.model.BookingRequest;
import com.example.ams.model.MaintenanceRequest;
import com.example.ams.repository.UserRepository;
import com.example.ams.repository.ApartmentRepository;
import com.example.ams.repository.BookingRequestRepository;
import com.example.ams.repository.MaintenanceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private BookingRequestRepository bookingRequestRepository;

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        
        // Convert to a safe format without password
        List<Map<String, Object>> userList = users.stream().map(user -> {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("phoneNumber", user.getPhoneNumber());
            userMap.put("role", user.getRole().toString().replace("ROLE_", ""));
            return userMap;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(userList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        
        if (!userOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();

        // Clean up related data
        // 1. Free up any apartments assigned to this user
        List<Apartment> apartments = apartmentRepository.findAll();
        apartments.stream()
            .filter(apt -> apt.getResident() != null && apt.getResident().getId().equals(id))
            .forEach(apt -> {
                apt.setResident(null);
                apartmentRepository.save(apt);
            });

        // 2. Delete all booking requests by this user
        List<BookingRequest> bookings = bookingRequestRepository.findByUser(user);
        bookingRequestRepository.deleteAll(bookings);

        // 3. Delete all maintenance requests by this user
        List<MaintenanceRequest> maintenanceRequests = maintenanceRequestRepository.findAll()
            .stream()
            .filter(req -> req.getUser() != null && req.getUser().getId().equals(id))
            .collect(Collectors.toList());
        maintenanceRequestRepository.deleteAll(maintenanceRequests);

        // 4. Finally, delete the user
        userRepository.delete(user);

        return ResponseEntity.ok().body("User deleted successfully");
    }

}

