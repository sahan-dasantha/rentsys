package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Tenant;

/**
 * Data Access Object (DAO) interface for the {@link Tenant} entity.
 * 
 * Inherits standard persistence operations from Spring Data JPA's JpaRepository,
 * eliminating the need to write boilerplate SQL or Hibernate code.
 */
@Repository // Marks this interface as a Data Access component managed by the Spring IoC container
public interface TenantRepo extends JpaRepository<Tenant , Long> {
    /**
     * Custom Derived Query Method to look up a Tenant by their email address.
     * 
     * How Spring Data JPA resolves this method:
     * - Parses "findByEmail" into a SQL SELECT query targeting the 'tenant' table:
     *   "SELECT * FROM tenant WHERE email = ?"
     * 
     * @param email The tenant's email address sent from authentication requests.
     * @return The matching Tenant entity, or null if no record matches the email.
     */
    Tenant findByEmail(String email);
    
} 
