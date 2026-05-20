package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Property;

@Repository
public interface PropertyRepo extends JpaRepository<Property, Long> {
    List<Property> findByOwner_OwnerId(Long ownerId);
    
} 
    

