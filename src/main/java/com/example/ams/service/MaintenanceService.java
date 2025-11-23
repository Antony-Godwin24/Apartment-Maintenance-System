package com.example.ams.service;

import com.example.ams.dto.MaintenanceDto;
import com.example.ams.model.Apartment;
import com.example.ams.model.MaintenanceRequest;
import com.example.ams.model.User;
import com.example.ams.repository.ApartmentRepository;
import com.example.ams.repository.MaintenanceRequestRepository;
import com.example.ams.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepository;

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private UserRepository userRepository;

    public MaintenanceRequest createRequest(String username, MaintenanceDto.CreateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Apartment apartment = apartmentRepository.findById(request.getApartmentId())
                .orElseThrow(() -> new RuntimeException("Apartment not found"));

        MaintenanceRequest maintenanceRequest = new MaintenanceRequest();
        maintenanceRequest.setDescription(request.getDescription());
        maintenanceRequest.setUser(user);
        maintenanceRequest.setApartment(apartment);

        return maintenanceRequestRepository.save(maintenanceRequest);
    }

    public List<MaintenanceDto.Response> getUserRequests(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return maintenanceRequestRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<MaintenanceDto.Response> getAllRequests() {
        return maintenanceRequestRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void likeRequest(Long id) {
        MaintenanceRequest request = maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setLikes(request.getLikes() + 1);
        maintenanceRequestRepository.save(request);
    }

    public void dislikeRequest(Long id) {
        MaintenanceRequest request = maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setDislikes(request.getDislikes() + 1);
        maintenanceRequestRepository.save(request);
    }

    public void updateStatus(Long id, String status) {
        MaintenanceRequest request = maintenanceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(MaintenanceRequest.Status.valueOf(status));
        maintenanceRequestRepository.save(request);
    }

    private MaintenanceDto.Response mapToResponse(MaintenanceRequest request) {
        MaintenanceDto.Response response = new MaintenanceDto.Response();
        response.setId(request.getId());
        response.setDescription(request.getDescription());
        response.setStatus(request.getStatus().name());
        response.setRequestDate(request.getRequestDate().toString());
        response.setUsername(request.getUser().getUsername());
        response.setApartmentUnit(request.getApartment().getUnitNumber());
        response.setLikes(request.getLikes());
        response.setDislikes(request.getDislikes());
        return response;
    }
}
