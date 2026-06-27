package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Agreement;

@Repository
public interface AgreementRepo extends JpaRepository<Agreement, Long> {
    // get all agreements (rented properties) for a specific tenant
    // used by RentedProperties.jsx to list everything a tenant has rented
    List<Agreement> findByResidentId(Long residentId);

    // get the agreement for a specific property - useful later for
    // payments/maintenance pages that need to know the active agreement
    List<Agreement> findByPropertyId(Long propertyId);

}
