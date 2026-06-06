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

@RestController
@RequiredArgsConstructor
@RequestMapping("/property")

public class PropertyController {

    private final PropertyService propertyService;

    // post - owner adds a property
    @PostMapping("{owner_id}")
    public ResponseEntity<Property> addProperty(@PathVariable Long owner_id, @RequestBody Property property) {

        return propertyService.addProperty(owner_id, property);
    }

    // get - get all properties of an owner
    @GetMapping("/owner/{owner_id}")
    public ResponseEntity<List<Property>> getByOwner(@PathVariable Long owner_id) {
        return propertyService.getPropertiesByOwner(owner_id);
    }

    // put - update a property
    @PutMapping("/{property_id}")
    public ResponseEntity<Property> update(@PathVariable Long property_id, @RequestBody Property property) {

        return propertyService.updateProperty(property_id, property);
    }

    // delete - delete a property
    @DeleteMapping("/{property_id}")
    public ResponseEntity<String> delete(@PathVariable Long property_id) {
        return propertyService.deleteProperty(property_id);
    }

    // GET /property — returns all properties for tenant search
    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        return propertyService.getAllProperties();
    }

    // GET /property/{propertyId}/detail
    // Returns property info + owner contact details combined in one response
    // Tenant's PropertyProfile page calls this when it loads
    @GetMapping("/{propertyId}/detail")
    public ResponseEntity<PropertyDetailDTO> getPropertyDetail(@PathVariable Long propertyId) {
        return ResponseEntity.ok(propertyService.getPropertyDetail(propertyId));
    }

}
