package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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

    //add new property
    public ResponseEntity<Property> addProperty(Long ownerId, Property property){
        Optional<Owner> optOwner = ownerRepo.findById(ownerId);
        if (optOwner.isPresent()){
            property.setOwner(optOwner.get()); //link to owner
            property.setStatus("AVAILABLE");  //default status
            return ResponseEntity.ok(propertyRepo.save(property));
        }
        throw new RuntimeException("Owner not found");
    }

    //get all properties of an owner
    public ResponseEntity<List<Property>> getPropertiesByOwner(Long ownerId){
        return ResponseEntity.ok(propertyRepo.findByOwner_OwnerId(ownerId));
    }

    //delete property
    public ResponseEntity<String> deleteProperty(Long propertyId){
        if(propertyRepo.existsById(propertyId)){
            propertyRepo.deleteById(propertyId);
            return ResponseEntity.ok("Property deleted");
        }
        throw new RuntimeException("Property not found");
    }

    //Update a property
    public ResponseEntity<Property> updateProperty(Long propertyId, Property property){
    Optional<Property> opt = propertyRepo.findById(propertyId);
    if (opt.isPresent()){
        Property p = opt.get();
        p.setAddress(property.getAddress());
        p.setType(property.getType());
        p.setRentAmount(property.getRentAmount());
        p.setStatus(property.getStatus());
        return ResponseEntity.ok(propertyRepo.save(p));
    }
    throw new RuntimeException("Property not found");
    }
    
}
