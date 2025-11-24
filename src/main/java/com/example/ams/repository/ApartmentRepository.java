package com.example.ams.repository;

import com.example.ams.model.Apartment;
import com.example.ams.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApartmentRepository extends MongoRepository<Apartment, String> {
    Optional<Apartment> findByResident(User resident);
}
