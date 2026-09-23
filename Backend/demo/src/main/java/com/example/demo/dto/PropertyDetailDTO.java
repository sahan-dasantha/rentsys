package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/**
 * Data Transfer Object (DTO) aggregating Property listing information 
 * with the associated Owner's contact details into a single response payload.
 * 
 * Used primarily by the React frontend when rendering the PropertyProfile view.
 * Solves the issue where Jackson's @JsonBackReference on the Property entity 
 * suppresses owner information to prevent infinite JSON recursion.
 */
@Getter // Lombok: Generates getter methods for all private fields
@Setter // Lombok: Generates setter methods for manual DTO construction
@AllArgsConstructor // Lombok: Generates constructor accepting all property and owner fields
@NoArgsConstructor // Lombok: Generates default zero-argument constructor for Jackson serialization
public class PropertyDetailDTO {

    // ── Property Specifications ──────────────────────────────────────

    /**
     * Unique primary key identifier of the property.
     */
    private Long propertyId;
    /**
     * Physical location or street address of the rental property.
     */
    private String address;
    /**
     * Property category/classification (e.g., "House", "Apartment", "Villa", "Room").
     */
    private String type;
    /**
     * Monthly rental rate charged for the property.
     */
    private Double rentAmount;
    /**
     * Current listing status (e.g., "Available", "Not Available", "Occupied").
     */
    private String status; 

    // ── Owner Contact Details ────────────────────────────────────────

    /**
     * Primary key identifier of the property owner.
     */
    private Long ownerId;
    /**
     * Full name of the owner for display in tenant rental inquiries.
     */
    private String ownerName;
    /**
     * Contact email address of the owner.
     */
    private String ownerEmail;
    /**
     * Direct contact phone number of the owner.
     */
    private String ownerPhone;

}
