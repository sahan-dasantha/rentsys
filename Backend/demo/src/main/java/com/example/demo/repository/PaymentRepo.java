package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Payment;

public interface PaymentRepo extends JpaRepository<Payment, Long> {
    List<Payment> findByPropertyId(Long propertyId); // owner fetches all payments for a property

    List<Payment> findByResidentId(Long residentId); // tenants fetches their own payments

    List<Payment> findByAgreementId(Long agreementId); // fetch all payments for a specific agreement

    List<Payment> findByPropertyIdAndResidentId(Long propertyId, Long residentId); // fetch payments for a specific
                                                                                   // tenant on a specific property

}
