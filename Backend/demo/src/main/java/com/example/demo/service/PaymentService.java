package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Payment;
import com.example.demo.repository.PaymentRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepo paymentRepo;

    // ── GET payments by property ──────────────────────────────────
    // Owner uses this to see all payments for a property
    public ResponseEntity<List<Payment>> getPaymentByPropertyId(Long propertyId) {

        List<Payment> payments = paymentRepo.findByPropertyId(propertyId);
        return ResponseEntity.ok(payments);
    }

    // ── GET payments by agreement ─────────────────────────────────
    // Tenant uses this to see their own payments
    public ResponseEntity<List<Payment>> getPaymentByAgreementId(Long agreementId) {

        List<Payment> payments = paymentRepo.findByAgreementId(agreementId);
        return ResponseEntity.ok(payments);
    }

    // ── UPLOAD receipt ────────────────────────────────────────────
    // Tenant uploads PDF receipt for a specific payment
    // Saves file to disk and updates payment status
    public ResponseEntity<Payment> uploadPaymentReceipt(Long paymentId, MultipartFile file) {

        // find the payment — throw error if not found
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));

        try {
            // ── SAVE FILE TO DISK ─────────────────────────────────
            // Create the uploads folder if it doesn't exist yet
            String uploadDir = "uploads/receipts";
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);

            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath); // create folder
            }

            // Generate a unique filename to avoid overwriting other files
            // Format: paymentId_originalFilename.pdf
            // e.g. "5_receipt_january.pdf"
            String filename = paymentId + "_" + file.getOriginalFilename();

            // Build the full path where file will be saved
            java.nio.file.Path filePath = uploadPath.resolve(filename);

            // Actually write the file bytes to disk
            java.nio.file.Files.copy(
                    file.getInputStream(),
                    filePath,
                    java.nio.file.StandardCopyOption.REPLACE_EXISTING); // overrite if re uploading

            // ── UPDATE PAYMENT RECORD ─────────────────────────────
            // Store just the filename — not the full path
            // This way if we move the server, only the config changes
            payment.setStatus("PENDING_CONFIRMATION");

            // save and return updated payment
            return ResponseEntity.ok(paymentRepo.save(payment));

        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }

    }

    // ── CONFIRM payment ───────────────────────────────────────────
    // Owner confirms payment after reviewing receipt
    public ResponseEntity<Payment> confirmPayment(Long paymentId) {
        Optional<Payment> optPayment = paymentRepo.findById(paymentId);

        if (optPayment.isPresent()) {
            Payment payment = optPayment.get(); // extract the object from Optional

            // update the fields
            payment.setStatus("PAID"); // mark as paid
            payment.setPaymentDate(LocalDate.now()); // record today as payment date

            // save updated payment back to DB and return it
            return ResponseEntity.ok(paymentRepo.save(payment));
        } else {
            throw new RuntimeException("Payment not found: " + paymentId);
        }

    }

    // ── DOWNLOAD/VIEW receipt ─────────────────────────────────────
    // Serves the PDF file so owner/tenant can view it in browser
    public ResponseEntity<Resource> getPaymentReceipt(String filename) {
        try {
            // Build the full path to the file
            java.nio.file.Path filePath = java.nio.file.Paths
                    .get("uploads/receipts")
                    .resolve(filename)
                    .normalize(); // normalize removes any ../ path tricks for security

            // Load the file as a Spring Resource
            Resource resource = new org.springframework.core.io.UrlResource(
                    filePath.toUri());

            // Check the file actually exists and is readable
            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("File not found: " + filename);
            }

            // Return the file with correct headers so browser opens it as PDF
            return ResponseEntity.ok().header("Content-Type", "application/pdf")
                    // "inline" means browser opens it directly
                    // use "attachment" instead if you want it to download
                    .header("Content-Disposition", "inline; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (java.net.MalformedURLException e) {
            throw new RuntimeException("Could not read file: " + filename);
        }

    }

}
