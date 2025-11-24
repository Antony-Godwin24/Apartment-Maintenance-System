package com.example.ams.controller;

import com.example.ams.model.Apartment;
import com.example.ams.repository.ApartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apartments")
public class ApartmentController {

    @Autowired
    private ApartmentRepository apartmentRepository;

    @PostMapping
    public ResponseEntity<Apartment> addApartment(@RequestBody Apartment apartment) {
        return ResponseEntity.ok(apartmentRepository.save(apartment));
    }

    @GetMapping
    public ResponseEntity<List<Apartment>> getAllApartments() {
        System.out.println("GET /api/apartments called");
        List<Apartment> apartments = apartmentRepository.findAll();
        System.out.println("Found " + apartments.size() + " apartments");
        return ResponseEntity.ok(apartments);
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<Apartment>> getApartmentAssignments() {
        List<Apartment> apartments = apartmentRepository.findAll();
        // Filter only apartments with residents
        List<Apartment> assignments = apartments.stream()
                .filter(apt -> apt.getResident() != null)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(assignments);
    }

}
