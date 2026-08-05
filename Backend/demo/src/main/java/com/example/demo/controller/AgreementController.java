package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Agreement;
import com.example.demo.repository.AgreementRepo;

@RestController
@RequestMapping("/agreement")

public class AgreementController {

    @Autowired
    private AgreementRepo agreementRepo;

    // ── GET /agreement/tenant/{residentId} ────────────────────────
    // Returns all agreements (rented properties) for a tenant
    // Called by RentedProperties.jsx when tenant clicks "Rented Properties"
    @GetMapping("/tenant/{residentId}")
    public ResponseEntity<List<Agreement>> getByTenant(@PathVariable Long residentId) {
        return ResponseEntity.ok(agreementRepo.findByResidentId(residentId));
    }
}
