package com.example.ams.repository;

import com.example.ams.model.Apartment;
import com.example.ams.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Long> {
    Optional<Apartment> findByResident(User resident);
}
