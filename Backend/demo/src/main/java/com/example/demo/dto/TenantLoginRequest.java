package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
/**
 * Data Transfer Object (DTO) for encapsulating Tenant login credentials.
 * 
 * Used by {@link com.example.demo.controller.TenantController} to deserialize incoming 
 * JSON payloads from the React frontend during tenant authentication requests.
 */
public class TenantLoginRequest {
    /**
     * The tenant's email address used as the primary login identifier.
     */
    private String email;
    /**
     * The tenant's raw password submitted from the login form.
     */
    private String password;
}
