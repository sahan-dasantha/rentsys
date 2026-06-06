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

@Service
@RequiredArgsConstructor

public class PropertyService {
    private final PropertyRepo propertyRepo;
    private final OwnerRepo ownerRepo;

    // add new property
    public ResponseEntity<Property> addProperty(Long ownerId, Property property) {
        Optional<Owner> optOwner = ownerRepo.findById(ownerId);
        if (optOwner.isPresent()) {
            property.setOwner(optOwner.get()); // link to owner
            property.setStatus("Available"); // default status
            return ResponseEntity.ok(propertyRepo.save(property));
        }
        throw new RuntimeException("Owner not found");
    }

    // get all properties of an owner
    public ResponseEntity<List<Property>> getPropertiesByOwner(Long ownerId) {
        return ResponseEntity.ok(propertyRepo.findByOwner_OwnerId(ownerId));
    }

    // delete property
    public ResponseEntity<String> deleteProperty(Long propertyId) {
        if (propertyRepo.existsById(propertyId)) {
            propertyRepo.deleteById(propertyId);
            return ResponseEntity.ok("Property deleted");
        }
        throw new RuntimeException("Property not found");
    }

    // Update a property
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

    // get ALL properties — used for tenant property search
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
