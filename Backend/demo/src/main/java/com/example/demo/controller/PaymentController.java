package com.example.demo.controller;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Payment;
import com.example.demo.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController // Combines @Controller and @ResponseBody; automatic JSON
                // serialization/deserialization for endpoints
@RequiredArgsConstructor // Lombok annotation: Generates constructor for all 'final' fields to enable
                         // Spring Dependency Injection
@RequestMapping("/payment")
public class PaymentController {

    // @RequiredArgsConstructor generates constructor for this final field
    private final PaymentService paymentService;

    // ── GET /payment/property/{propertyId} ────────────────────────
    // Owner fetches all payments for one of their properties
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Payment>> getPaymentByPropertyId(@PathVariable Long propertyId) {
        return paymentService.getPaymentByPropertyId(propertyId);
    }

    // ── GET /payment/agreement/{agreementId} ──────────────────────
    // Tenant fetches all payments for their agreement
    @GetMapping("/agreement/{agreementId}")
    public ResponseEntity<List<Payment>> getPaymentByAgreementId(@PathVariable Long agreementId) {
        return paymentService.getPaymentByAgreementId(agreementId);
    }

    // ── POST /payment/{paymentId}/upload-receipt ──────────────────
    // Tenant uploads PDF receipt for a specific payment
    // file comes as multipart form data from the frontend
    @PostMapping("/{paymentId}/upload-receipt")
    public ResponseEntity<Payment> uploadPaymentReceipt(@PathVariable Long paymentId,
            @RequestParam("file") MultipartFile file) {
        return paymentService.uploadPaymentReceipt(paymentId, file);
    }

    // ── PUT /payment/{paymentId}/confirm ──────────────────────────
    // Owner confirms a payment after reviewing the receipt
    @PutMapping("/{paymentId}/confirm")
    public ResponseEntity<Payment> confirmPayment(@PathVariable Long paymentId) {
        return paymentService.confirmPayment(paymentId);
    }

    // ── GET /payment/receipt/{filename} ───────────────────────────
    // Serves the PDF file so owner/tenant can view or download it
    @GetMapping("/receipt/{filename}")
    public ResponseEntity<Resource> getPaymentReceipt(@PathVariable String filename) {
        return paymentService.getPaymentReceipt(filename);
    }
}
