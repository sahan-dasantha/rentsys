package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Property;
/**
 * Spring Data JPA Repository interface for managing {@link Property} entities.
 * 
 * Provides built-in CRUD operations, pagination, and sorting out-of-the-box by extending 
 * {@link JpaRepository}, as well as custom derived query methods for property queries.
 */
@Repository // Marks this interface as a Spring Data repository component for exception translation
public interface PropertyRepo extends JpaRepository<Property, Long> {
    /**
     * Derived query method to find all properties owned by a specific Owner.
     * 
     * Uses Spring Data JPA property expression traversal:
     * - "findByOwner": Navigates the @ManyToOne 'owner' relationship in the Property entity.
     * - "_OwnerId": Selects the 'ownerId' primary key field on the target Owner entity.
     * 
     * @param ownerId Primary key ID of the target owner.
     * @return List of Property entities belonging to the specified owner.
     */
    List<Property> findByOwner_OwnerId(Long ownerId);
    
} 
    

