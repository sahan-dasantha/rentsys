package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.RentalRequest;
import com.example.demo.service.RentalRequestService;

@RestController
@RequestMapping("/rental-request") // all endpoints start with rental-request
// @CrossOrigin(origins = "http://localhost:5173") // allow your React frontend
// to call this
public class RentalRequestController {

    @Autowired
    private RentalRequestService rentalRequestService;

    // ── POST /rental-request ─────────────────────────────────────────
    // Tenant submits the agreement form
    // React sends: { residentId, propertyId, proposedStartDate, proposedEndD
    @PostMapping
    public ResponseEntity<RentalRequest> createRequest(@RequestBody RentalRequest request) {
        RentalRequest saved = rentalRequestService.createRequest(request);
        return ResponseEntity.ok(saved);
    }

    // ── GET /rental-request/property/{propertyId} ────────────────────
    // Owner fetches all requests for one of their properties
    @GetMapping("property/{propertyId}")
    public ResponseEntity<List<RentalRequest>> getByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(rentalRequestService.getRequestByProperty(propertyId));
    }

    // ── PUT /rental-request/{requestId}/respond?decision=ACCEPTED ────
    // Owner clicks Accept or Reject
    // decision comes as a query param: ?decision=ACCEPTED or ?decision=REJECTED
    @PutMapping("/{requestId}/respond")
    public ResponseEntity<RentalRequest> respond(
            @PathVariable Long requestId,
            @RequestParam String decision) {

        RentalRequest updated = rentalRequestService.respondToRequest(requestId, decision);
        return ResponseEntity.ok(updated);
    }

    // ── GET /rental-request/tenant/{residentId} ──────────────────────
    // Tenant checks the status of all their own requests
    // Called by TenantRequests.jsx when the page loads
    @GetMapping("/tenant/{residentId}")
    public ResponseEntity<List<RentalRequest>> getByTenant(@PathVariable Long residentId) {
        return ResponseEntity.ok(rentalRequestService.getRequestsByTenant(residentId));
    }

    // ── DELETE /rental-request/{requestId} ───────────────────────────
    // Tenant cancels their own PENDING request
    // Only works on PENDING — service throws error for ACCEPTED/REJECTED
    @DeleteMapping("/{requestId}")
    public ResponseEntity<String> deleteRequest(@PathVariable Long requestId) {
        rentalRequestService.deleteRequest(requestId);
        return ResponseEntity.ok("Request cancelled successfully.");
    }

}
