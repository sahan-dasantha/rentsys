package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.RentalRequest;
import java.util.List;


public interface RentalRequestRepo extends JpaRepository<RentalRequest, Long> {
// Get all requests sent to a specific property
    // Spring JPA auto-generates the SQL: SELECT * FROM rental_request WHERE property_id = ?
    List<RentalRequest> findByPropertyId(Long propertyId);

    //Get all the requests made by a specific tenant
    //Used to show tenant their own request history
    List<RentalRequest> findByResidentId(Long residentId);

    //Get all Pending requests for a specific property
    //Used by owner to see only new unsolved requests
    List<RentalRequest> findByPropertyIdAndStatus(Long propertyId, String status);
    
} 
