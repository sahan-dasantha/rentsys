package com.example.demo.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "agreement")

public class Agreement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "agreement_id")
    private Long agreementId;

    // who is renting — links to Tenant by residentId
    @Column(name = "resident_id")
    private Long residentId;

    // which property is being rented — links to Property
    @Column(name = "property_id")
    private Long propertyId;

    // the rental period - copied from the accepted RentalRequest
    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    // the agreed monthly rent - copied from property at the time of acceptance
    // stored seperately because property rent could change later
    // but the agreement should keep the orginal agreed amount
    @Column(name = "rent_amount")
    private Double rentAmount;

    // date this agreement was created usefull for display
    @Column(name = "created_at")
    private LocalDate createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDate.now();
    }

}
