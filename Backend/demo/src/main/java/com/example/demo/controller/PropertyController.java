package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.PropertyDetailDTO;
import com.example.demo.model.Property;
import com.example.demo.service.PropertyService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;

/**
 * REST Controller exposing API endpoints for managing rental properties.
 * 
 * Provides HTTP routes for property creation, retrieval by owner or general listings,
 * property detail aggregation DTOs, updates, and deletions.
 */
@RestController // Combines @Controller and @ResponseBody; automatically serializes return values to JSON
@RequiredArgsConstructor // Lombok: Generates constructor injection for required private final fields
@RequestMapping("/property") // Base URL path prefix for all endpoints defined in this controller

public class PropertyController {

    /**
     * Injected service dependency carrying business logic for property operations.
     */
    private final PropertyService propertyService;

    /**
     * Endpoint for an Owner to create and associate a new property listing.
     * 
     * Route: POST /property/{owner_id}
     * 
     * @param owner_id ID of the property owner extracted from URL path.
     * @param property Property entity payload deserialized from HTTP request body.
     * @return ResponseEntity wrapping the newly created Property entity.
     */
    @PostMapping("/{owner_id}")
    public ResponseEntity<Property> addProperty(@PathVariable Long owner_id, @RequestBody Property property) {

        return propertyService.addProperty(owner_id, property);
    }

    /**
     * Endpoint to retrieve all properties belonging to a specific Owner.
     * 
     * Route: GET /property/owner/{owner_id}
     * 
     * @param owner_id ID of the target owner.
     * @return ResponseEntity containing a list of Property entities associated with the owner.
     */
    @GetMapping("/owner/{owner_id}")
    public ResponseEntity<List<Property>> getByOwner(@PathVariable Long owner_id) {
        return propertyService.getPropertiesByOwner(owner_id);
    }

    /**
     * Endpoint to update an existing property's details.
     * 
     * Route: PUT /property/{property_id}
     * 
     * @param property_id Primary key ID of the property to update.
     * @param property Entity payload containing updated property fields.
     * @return ResponseEntity wrapping the updated Property object.
     */
    @PutMapping("/{property_id}")
    public ResponseEntity<Property> update(@PathVariable Long property_id, @RequestBody Property property) {

        return propertyService.updateProperty(property_id, property);
    }

    /**
     * Endpoint to remove a property listing by ID.
     * 
     * Route: DELETE /property/{property_id}
     * 
     * @param property_id ID of the property to delete.
     * @return ResponseEntity containing confirmation message string.
     */
    @DeleteMapping("/{property_id}")
    public ResponseEntity<String> delete(@PathVariable Long property_id) {
        return propertyService.deleteProperty(property_id);
    }

    /**
     * Endpoint to fetch all available property listings across the platform.
     * Used primarily by Tenants for property search and browsing.
     * 
     * Route: GET /property
     * 
     * @return ResponseEntity containing list of all registered Property records.
     */
    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        return propertyService.getAllProperties();
    }

    /**
     * Composite endpoint retrieving property details along with Owner contact information.
     * Called when a Tenant loads a specific PropertyProfile page in the React frontend.
     * 
     * Route: GET /property/{propertyId}/detail
     * 
     * @param propertyId Target property ID.
     * @return ResponseEntity wrapping the combined PropertyDetailDTO payload.
     */
    @GetMapping("/{propertyId}/detail")
    public ResponseEntity<PropertyDetailDTO> getPropertyDetail(@PathVariable Long propertyId) {
        return ResponseEntity.ok(propertyService.getPropertyDetail(propertyId));
    }

}
