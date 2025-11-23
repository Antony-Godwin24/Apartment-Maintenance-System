package com.example.ams.repository;

import com.example.ams.model.MaintenanceRequest;
import com.example.ams.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByUser(User user);
}
