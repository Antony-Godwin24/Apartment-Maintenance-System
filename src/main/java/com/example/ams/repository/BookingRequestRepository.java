package com.example.ams.repository;

import com.example.ams.model.BookingRequest;
import com.example.ams.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookingRequestRepository extends MongoRepository<BookingRequest, String> {
    List<BookingRequest> findByUser(User user);
    List<BookingRequest> findByStatus(String status);
    List<BookingRequest> findByApartmentAndStatus(com.example.ams.model.Apartment apartment, String status);
}
