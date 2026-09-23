package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
/**
 * Data Transfer Object (DTO) representing the sanitized response payload
 * returned to the React frontend upon successful Tenant authentication.
 * 
 * Excludes sensitive entity data (such as passwords or internal security flags)
 * to ensure client-side state only receives safe, necessary user attributes.
 */
@Getter // Lombok: Generates getter methods required by Jackson for JSON serialization
@AllArgsConstructor // Lombok: Generates a constructor with all arguments (residentId, fullName, email)

public class TenantLoginResponse {
    /**
     * Unique identifier for the authenticated tenant.
     * Maps to the 'resident_id' primary key from the Tenant entity.
     */
    private Long residentId;
    /**
     * Full name of the authenticated tenant for display in the application UI/header.
     */
    private String fullName;
    /**
     * Email address associated with the authenticated tenant account.
     */
    private String email;
}
