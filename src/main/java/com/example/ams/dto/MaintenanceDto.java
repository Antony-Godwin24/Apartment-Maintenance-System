package com.example.ams.dto;

import lombok.Data;

public class MaintenanceDto {
    public static class CreateRequest {
        private String description;


        private String apartmentId;

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getApartmentId() {
            return apartmentId;
        }

        public void setApartmentId(String apartmentId) {
            this.apartmentId = apartmentId;
        }
    }

    public static class Response {
        private String id;
        private String description;
        private String status;
        private String requestDate;
        private String username;
        private String apartmentUnit;
        private int likes;
        private int dislikes;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getRequestDate() {
            return requestDate;
        }

        public void setRequestDate(String requestDate) {
            this.requestDate = requestDate;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getApartmentUnit() {
            return apartmentUnit;
        }

        public void setApartmentUnit(String apartmentUnit) {
            this.apartmentUnit = apartmentUnit;
        }

        public int getLikes() {
            return likes;
        }

        public void setLikes(int likes) {
            this.likes = likes;
        }

        public int getDislikes() {
            return dislikes;
        }

        public void setDislikes(int dislikes) {
            this.dislikes = dislikes;
        }
    }
}
