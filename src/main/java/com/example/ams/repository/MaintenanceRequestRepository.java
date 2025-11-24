package com.example.ams.repository;

import com.example.ams.model.MaintenanceRequest;
import com.example.ams.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends MongoRepository<MaintenanceRequest, String> {
    List<MaintenanceRequest> findByUser(User user);
}
