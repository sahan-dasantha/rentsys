package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.dto.PropertyDetailDTO;
import com.example.demo.model.Owner;
import com.example.demo.model.Property;
import com.example.demo.repository.OwnerRepo;
import com.example.demo.repository.PropertyRepo;

import lombok.RequiredArgsConstructor;
/**
 * Service class handling core business logic for Property management.
 * 
 * Manages operations such as property creation linked to an owner, partial or full updates,
 * filtered/unfiltered searches, deletion, and composite DTO construction to expose owner contact info.
 */
@Service // Registers this class as a managed Service component in Spring's Application Context
@RequiredArgsConstructor // Lombok: Generates constructor injection for required private final fields

public class PropertyService {
    /**
     * Repository dependency for executing CRUD operations on Property entities.
     */
    private final PropertyRepo propertyRepo;
    /**
     * Repository dependency for fetching Owner records to link foreign keys.
     */
    private final OwnerRepo ownerRepo;

    /**
     * Registers a new rental property and associates it with a specific Owner.
     * 
     * Applies fallback default values (e.g., status "Available") if not specified by the user.
     * 
     * @param ownerId ID of the listing owner.
     * @param property Entity containing new property details.
     * @return ResponseEntity containing the persisted Property instance.
     * @throws RuntimeException if no Owner exists for the given ownerId.
     */
    public ResponseEntity<Property> addProperty(Long ownerId, Property property) {
        Optional<Owner> optOwner = ownerRepo.findById(ownerId);
        if (optOwner.isPresent()) {
            property.setOwner(optOwner.get()); // Link entity relationship (populates owner_id foreign key)
            // Assign default status "Available" only if the request payload leaves it blank/null
            if (property.getStatus() == null || property.getStatus().isBlank()) {
                property.setStatus("Available"); // default only if nothing was sent
            }
            return ResponseEntity.ok(propertyRepo.save(property));
        }
        throw new RuntimeException("Owner not found");
    }

    /**
     * Fetches all properties belonging to a specific Owner ID.
     * 
     * Leverages Spring Data JPA's nested field navigation query method (findByOwner_OwnerId).
     * 
     * @param ownerId Target owner primary key.
     * @return ResponseEntity wrapping the list of matching Property records.
     */
    public ResponseEntity<List<Property>> getPropertiesByOwner(Long ownerId) {
        return ResponseEntity.ok(propertyRepo.findByOwner_OwnerId(ownerId));
    }

    /**
     * Removes a property listing from the system by ID.
     * 
     * @param propertyId Primary key of the property to delete.
     * @return ResponseEntity with confirmation message string.
     * @throws RuntimeException if the property does not exist.
     */
    public ResponseEntity<String> deleteProperty(Long propertyId) {
        if (propertyRepo.existsById(propertyId)) {
            propertyRepo.deleteById(propertyId);
            return ResponseEntity.ok("Property deleted");
        }
        throw new RuntimeException("Property not found");
    }

    /**
     * Updates field values for an existing Property record.
     * 
     * Fetches existing record, mutates address, type, rent amount, and status properties,
     * and saves changes back to the database.
     * 
     * @param propertyId ID of property to update.
     * @param property Entity carrying updated attributes.
     * @return ResponseEntity containing updated Property record.
     * @throws RuntimeException if target property ID is not found.
     */
    public ResponseEntity<Property> updateProperty(Long propertyId, Property property) {
        Optional<Property> opt = propertyRepo.findById(propertyId);
        if (opt.isPresent()) {
            Property p = opt.get();
            p.setAddress(property.getAddress());
            p.setType(property.getType());
            p.setRentAmount(property.getRentAmount());
            p.setStatus(property.getStatus());
            return ResponseEntity.ok(propertyRepo.save(p));
        }
        throw new RuntimeException("Property not found");
    }

    /**
     * Retrieves all registered properties in the database.
     * Primary endpoint invoked by Tenants browsing property listings.
     * 
     * @return ResponseEntity containing complete list of Property entities.
     */
    public ResponseEntity<List<Property>> getAllProperties() {
        return ResponseEntity.ok(propertyRepo.findAll());
    }

    // ── GET PROPERTY WITH OWNER DETAILS ─────────────────────────────
    // Returns a DTO combining property + owner contact info
    // Called when tenant clicks a property card to view its full profile
    // We use a DTO instead of returning Property directly because
    // @JsonBackReference on the owner field hides owner data in normal responses
    public PropertyDetailDTO getPropertyDetail(Long propertyId) {

        // Find the property or throw a clear error
        Property property = propertyRepo.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found: " + propertyId));

        // Create the DTO and fill property fields
        PropertyDetailDTO dto = new PropertyDetailDTO();
        dto.setPropertyId(property.getPropertyId());
        dto.setAddress(property.getAddress());
        dto.setType(property.getType());
        dto.setRentAmount(property.getRentAmount());
        dto.setStatus(property.getStatus());

        // Fill owner fields — owner is loaded automatically by JPA via @ManyToOne
        if (property.getOwner() != null) {
            dto.setOwnerId(property.getOwner().getOwnerId());
            dto.setOwnerName(property.getOwner().getFullName());
            dto.setOwnerEmail(property.getOwner().getEmail());
            dto.setOwnerPhone(property.getOwner().getPhoneNumber());
        }

        return dto;
    }

}
