package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PropertyDetailDTO {

    // Property fields
    private Long propertyId;
    private String address;
    private String type; // "House", "Apartment", "Villa", "Room"
    private Double rentAmount;
    private String status; // "Available" or "Not Available"

    // ── Owner contact details ────────────────────────────────────────
    // Tenant needs these to know who they're renting from
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
    private String ownerPhone;

}
