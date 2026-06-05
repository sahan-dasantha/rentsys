package com.example.demo.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "rental_request")
public class RentalRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    //who  is requesting
    private Long residentId;

    //Which property
    private Long propertyId;

    //Agreement details filled by tenant
    private LocalDate proposedStartDate;
    private LocalDate proposedEndDate;
    private String message; // optional note from tenant

    // PENDING → ACCEPTED or REJECTED
    private String status; // "PENDING", "ACCEPTED", "REJECTED"

    private LocalDate createdAt;

    @PrePersist
    public void prePersist() {
        this.status = "PENDING";
        this.createdAt = LocalDate.now();
    }
}
