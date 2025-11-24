package com.example.ams.controller;

import com.example.ams.model.Apartment;
import com.example.ams.model.BookingRequest;
import com.example.ams.model.User;
import com.example.ams.repository.ApartmentRepository;
import com.example.ams.repository.BookingRequestRepository;
import com.example.ams.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRequestRepository bookingRequestRepository;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isPresent()) {
            request.setUser(user.get());
            request.setStatus("PENDING");
            request.setRequestDate(LocalDateTime.now());
            
            // Check if apartment is already booked or pending
            Optional<Apartment> apartment = apartmentRepository.findById(request.getApartment().getId());
            if (apartment.isPresent()) {
                if (apartment.get().getResident() != null) {
                     return ResponseEntity.badRequest().body("Apartment is already occupied.");
                }
                
                // Check for pending requests
                List<BookingRequest> pendingRequests = bookingRequestRepository.findByApartmentAndStatus(apartment.get(), "PENDING");
                if (!pendingRequests.isEmpty()) {
                    return ResponseEntity.badRequest().body("Apartment already has a pending booking request.");
                }

                request.setApartment(apartment.get());
                return ResponseEntity.ok(bookingRequestRepository.save(request));
            }
            return ResponseEntity.badRequest().body("Apartment not found.");
        }
        return ResponseEntity.badRequest().body("User not found.");
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingRequest>> getMyBookings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Optional<User> user = userRepository.findByUsername(username);

        return user.map(value -> ResponseEntity.ok(bookingRequestRepository.findByUser(value)))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @GetMapping
    public ResponseEntity<List<BookingRequest>> getAllBookings() {
        return ResponseEntity.ok(bookingRequestRepository.findAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody String status) {
        Optional<BookingRequest> booking = bookingRequestRepository.findById(id);
        if (booking.isPresent()) {
            BookingRequest request = booking.get();
            request.setStatus(status);
            
            if ("APPROVED".equals(status)) {
                Apartment apartment = request.getApartment();
                apartment.setResident(request.getUser());
                apartmentRepository.save(apartment);
            }
            
            return ResponseEntity.ok(bookingRequestRepository.save(request));
        }
        return ResponseEntity.notFound().build();
    }
}
