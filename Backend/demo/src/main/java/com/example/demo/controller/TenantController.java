package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.TenantLoginRequest;
import com.example.demo.model.Tenant;
import com.example.demo.service.TenantService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * REST Controller for managing Tenant (Resident) operations in the Home Rental API.
 * 
 * Provides HTTP endpoints consumed by the React/Vite frontend application.
 */

@RestController // Combines @Controller and @ResponseBody; automatic JSON serialization/deserialization for endpoints
@RequiredArgsConstructor // Lombok annotation: Generates constructor for all 'final' fields to enable Spring Dependency Injection
@RequestMapping("/tenant") // Base URL path for all endpoints in this controller ( eg.:http://localhost:8081/tenant)
public class TenantController {
    
    /**
     * Dependency injection of the TenantService layer handling business logic.
     * Marked 'final' to allow constructor injection via @RequiredArgsConstructor.
     */

    private final TenantService tenantService;

    /**
     * Create / Register a new Tenant account.
     * 
     * Endpoint: POST http://localhost:8081/tenant
     * 
     * @param tenant The tenant object parsed from the incoming JSON request payload.
     * @return ResponseEntity wrapping the newly saved Tenant entity.
     */

    @PostMapping
    public ResponseEntity<Tenant> saveTenant(@RequestBody Tenant tenant){
        // @RequestBody binds the HTTP request body JSON to the Tenant Java model
        return tenantService.saveTenant(tenant);
    }

    /**
     * Retrieve all registered Tenants.
     * 
     * Endpoint: GET http://localhost:8081/tenant
     * 
     * @return ResponseEntity containing a list of all Tenant records.
     */
    @GetMapping
    public ResponseEntity<List<Tenant>>getAllTenants(){
        return tenantService.getAllTenants();
        
    }

    /**
     * Retrieve a specific Tenant by their ID.
     * 
     * Endpoint: GET http://localhost:8081/tenant/{tenant_id} (e.g., /tenant/3)
     * 
     * @param tenant_id The tenant's primary key extracted from the URI path.
     * @return ResponseEntity containing the found Tenant entity.
     */
    @GetMapping("/{tenant_id}")
    public ResponseEntity<Tenant>getTenantById(@PathVariable Long tenant_id){
        // @PathVariable maps the URI template variable {tenant_id} directly into the method argument
        return tenantService.getTenantById(tenant_id);
    }

    /**
     * Update an existing Tenant's profile information.
     * 
     * Endpoint: PUT http://localhost:8081/tenant/{tenant_id}
     * 
     * @param tenant_id The ID of the target tenant to be updated.
     * @param tenant Updated field values received in the JSON body payload.
     * @return ResponseEntity wrapping the updated Tenant entity.
     */
    @PutMapping("/{tenant_id}")
    public ResponseEntity<Tenant>updateTenant(@PathVariable Long tenant_id, @RequestBody Tenant tenant){//geting the tenant id that sould be passed and the tenant that should be updated
        return tenantService.updateTenant(tenant_id, tenant);
    }

    /**
     * Delete a Tenant account by ID.
     * 
     * Endpoint: DELETE http://localhost:8081/tenant/{tenant_id}
     * 
     * @param tenant_id ID of the tenant record to be removed from the database.
     * @return ResponseEntity containing a plain text confirmation message.
     */
    @DeleteMapping("/{tenant_id}")
    public ResponseEntity<String> deleteTenant(@PathVariable Long tenant_id){
        return tenantService.deleteTenant(tenant_id);
    } 

    /**
     * Authenticate a Tenant during login.
     * 
     * Endpoint: POST http://localhost:8080/tenant/tenantlogin
     * 
     * @param loginRequest DTO holding tenant login credentials (email and password).
     * @return ResponseEntity with generic wildcard type (?) supporting dynamic login success or error payloads.
     */
    @PostMapping("/tenantlogin")
    public ResponseEntity<?> loginTenant(@RequestBody TenantLoginRequest loginRequest) {
        
        return tenantService.loginTenant(loginRequest);
    }
}
