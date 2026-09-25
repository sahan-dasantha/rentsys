package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Agreement;
import com.example.demo.model.Payment;
import com.example.demo.model.Property;
import com.example.demo.model.RentalRequest;
import com.example.demo.repository.AgreementRepo;
import com.example.demo.repository.PaymentRepo;
import com.example.demo.repository.PropertyRepo;
import com.example.demo.repository.RentalRequestRepo;

@Service
public class RentalRequestService {
    @Autowired
    private RentalRequestRepo rentalRequestRepo;

    @Autowired
    private PropertyRepo propertyRepo; // To update property status

    @Autowired
    private AgreementRepo agreementRepo; // needed to create agreement on acceptance

    @Autowired
    private PaymentRepo paymentRepo; // needed to generate payments on agreement creation

    // ── CREATE ───────────────────────────────────────────────────────
    // Tenant submits agreement form → saves a new request with status PENDING
    public RentalRequest createRequest(RentalRequest request) {
        return rentalRequestRepo.save(request);
        // @PrePersist in the entity automatically sets status="PENDING" and
        // createdAt=today
    }

    // ── GET BY PROPERTY ──────────────────────────────────────────────
    // Owner opens their profile → fetch all requests for their properties
    public List<RentalRequest> getRequestByProperty(Long propertyId) {
        return rentalRequestRepo.findByPropertyId(propertyId);
    }

    // ── GET BY TENANT ────────────────────────────────────────────────
    // Tenant wants to see the status of their own requests
    public List<RentalRequest> getRequestsByTenant(Long residentId) {
        return rentalRequestRepo.findByResidentId(residentId);
    }

    // ── RESPOND (ACCEPT or REJECT) ───────────────────────────────────
    // Owner clicks Accept or Reject button
    // requestId → which request, decision → "ACCEPTED" or "REJECTED"
    public RentalRequest respondToRequest(Long requestId, String decision) {

        // find the request,throw error if not found
        RentalRequest request = rentalRequestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));

        // Update the status to ACCEPTED or REJECTED
        request.setStatus(decision);
        rentalRequestRepo.save(request);

        // Step 3: If owner ACCEPTED → mark property as Not Available
        // If owner REJECTED → property stays Available (no change needed)
        if ("ACCEPTED".equals(decision)) {

            Property property = propertyRepo.findById(request.getPropertyId())
                    .orElseThrow(() -> new RuntimeException("Property not found"));

            property.setStatus("Not Available"); // match the exact string which frontend expects
            propertyRepo.save(property);

            // ── CREATE THE AGREEMENT ──────────────────────────────────
            // This is the official rental contract — created automatically
            // the moment the owner accepts the tenant's request
            Agreement agreement = new Agreement();
            agreement.setResidentId(request.getResidentId());
            agreement.setPropertyId(request.getPropertyId());
            agreement.setStartDate(request.getProposedStartDate());
            agreement.setEndDate(request.getProposedEndDate());
            agreement.setRentAmount(property.getRentAmount());
            agreementRepo.save(agreement); // saves to DB

            // ── AUTO-GENERATE MONTHLY PAYMENTS ───────────────────────────
            // Loop through each month from startDate to endDate
            // Create one Payment record per month with status UNPAID
            // YearMonth is a Java class that makes month arithmetic easy
            java.time.YearMonth start = java.time.YearMonth.from(request.getProposedStartDate());
            java.time.YearMonth end = java.time.YearMonth.from(request.getProposedEndDate());

            // loop month by month from start to end (inclusive)
            for (java.time.YearMonth month = start; !month.isAfter(end); month = month.plusMonths(1)) {

                Payment payment = new Payment();
                payment.setAgreementId(agreement.getAgreementId());
                payment.setResidentId(request.getResidentId());
                payment.setPropertyId(request.getPropertyId());

                // format as "2024-01" — easy to display and sort
                payment.setPaymentMonth(month.toString());

                // due date is always the first of each month
                payment.setDueDate(month.atDay(1));

                // lock in the rent amount at the time of agreement
                payment.setAmount(property.getRentAmount());

                // paymentDate and receiptPath stay null until tenant pays
                // status auto-set to "UNPAID" by @PrePersist

                paymentRepo.save(payment);
            }
        }

        return request; // return updated request so frontend can react
    }

    // ── DELETE REQUEST ───────────────────────────────────────────────
    // Tenant cancels a PENDING request
    // We only allow deleting PENDING requests — not ACCEPTED or REJECTED
    // because those have already been acted on by the owner
    public void deleteRequest(Long requestId) {
        // Find the request - throw clear error if not found
        RentalRequest request = rentalRequestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found: " + requestId));

        // safety check — only PENDING requests can be deleted
        // if owner already accepted/rejected, tenant cannot undo it
        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Only pending requests can be cancelled.");
        }

        rentalRequestRepo.deleteById(requestId);
    }
}
