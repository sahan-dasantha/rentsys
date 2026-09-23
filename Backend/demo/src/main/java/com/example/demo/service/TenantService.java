package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import com.example.demo.dto.TenantLoginRequest;
import com.example.demo.dto.TenantLoginResponse;
import com.example.demo.model.Tenant;
import com.example.demo.repository.TenantRepo;

import lombok.RequiredArgsConstructor;
/**
 * Service class handling core business logic for Tenant operations.
 * 
 * Acts as an intermediate layer between the TenantController and TenantRepo,
 * handling persistence logic, partial record updates, validation, and authentication.
 */
@Service // Marks this class as a Spring Service component in the IoC container
@RequiredArgsConstructor // Generates a constructor for private final fields (enables clean constructor dependency injection)


public class TenantService {
    /**
     * Repository dependency for performing CRUD operations on the tenant table.
     */
    private final TenantRepo tenantRepo;

    /**
     * Persists a new Tenant record to the database.
     * 
     * @param tenant The tenant entity to be created.
     * @return ResponseEntity wrapping the newly saved Tenant entity.
     * @throws RuntimeException if the record fails to generate an ID during persistence.
     */
    public ResponseEntity<Tenant> saveTenant(Tenant tenant){
        tenant = tenantRepo.save(tenant);

        // Verification check to ensure auto-increment primary key was populated
        if(tenant.getResidentId() == null){
            throw new RuntimeException("Tenant request is failed!");
        }else{
            return ResponseEntity.ok(tenant);
        }
    }

    /**
     * Retrieves all Tenants registered in the system.
     * 
     * @return ResponseEntity containing a list of all Tenant records.
     */
    public ResponseEntity<List<Tenant>> getAllTenants(){

        List<Tenant> tenantList = tenantRepo.findAll();
        return ResponseEntity.ok(tenantList);
    }

    /**
     * Retrieves a specific Tenant by primary key ID.
     * 
     * @param tenant_id The unique ID of the target tenant.
     * @return ResponseEntity containing the found Tenant entity.
     * @throws RuntimeException if tenant_id is null or if no tenant exists with the given ID.
     */
    public ResponseEntity<Tenant> getTenantById(Long tenant_id){
        if(tenant_id == null){
            throw new RuntimeException("Tenant id is required!");
        }else{
            Optional<Tenant> optTenant = tenantRepo.findById(tenant_id);
            if(optTenant.isPresent()){
                return ResponseEntity.ok(optTenant.get());
            }else{
                // Fixed exception messaging to accurately refer to tenant id instead of owner id
                throw new RuntimeException("Data not found for given tenant id!");
            }
        }
    }

    /**
     * Performs a partial update (PATCH-like behavior) on an existing Tenant record.
     * 
     * Reads existing tenant values, selectively updates non-null incoming fields,
     * and saves the updated entity back to the database.
     * 
     * @param tenant_id Target tenant's ID.
     * @param tenant Entity object containing updated field values.
     * @return ResponseEntity wrapping the updated Tenant entity.
     * @throws RuntimeException if target tenant ID is not found.
     */
    public ResponseEntity<Tenant> updateTenant(Long tenant_id, Tenant tenant){
        if(tenant_id == null){
            throw new RuntimeException("Tenant id is required!");
        }else{
            Optional<Tenant> optTenant = tenantRepo.findById(tenant_id);

            if(optTenant.isPresent()){

                Tenant tenantUpdateObj = optTenant.get(); // Fetch existing entity instance

             // Selectively update properties only if new non-null values are supplied
            if(tenant.getFullName() != null)        tenantUpdateObj.setFullName(tenant.getFullName());
            if(tenant.getNationalId() != null)      tenantUpdateObj.setNationalId(tenant.getNationalId());
            if(tenant.getPhoneNumber() != null)     tenantUpdateObj.setPhoneNumber(tenant.getPhoneNumber());
            if(tenant.getEmail() != null)           tenantUpdateObj.setEmail(tenant.getEmail());
            if(tenant.getOccupation() != null)      tenantUpdateObj.setOccupation(tenant.getOccupation());
            if(tenant.getDateRegistered() != null)  tenantUpdateObj.setDateRegistered(tenant.getDateRegistered());
            if(tenant.getPassword() != null)        tenantUpdateObj.setPassword(tenant.getPassword());

                tenantUpdateObj = tenantRepo.save(tenantUpdateObj);//save data inthe database
                return ResponseEntity.ok(tenantUpdateObj);
            }else{
                throw new RuntimeException("Data not found for given tenant id!");
            }
        }
    }

    /**
     * Deletes a Tenant record by primary key ID.
     * 
     * @param tenant_id ID of the tenant to be removed.
     * @return ResponseEntity containing a plain string confirmation message.
     * @throws RuntimeException if no record matches the given ID.
     */
    public ResponseEntity<String> deleteTenant(Long tenant_id){
        if(tenant_id == null){
            throw new RuntimeException("Tenant id is required!");
        }else{
            Optional<Tenant> optTenant = tenantRepo.findById(tenant_id);
            if(optTenant.isPresent()){
                tenantRepo.deleteById(tenant_id);
                return ResponseEntity.ok("Tenant was deleted.");
            }else{
                throw new RuntimeException("Data not found for given tenant id!");
            }
        }

    }

    /**
     * Validates tenant login credentials and constructs a response DTO upon success.
     * 
     * @param loginRequest DTO carrying incoming email and plain-text password from React frontend.
     * @return ResponseEntity with safe response payload (TenantLoginResponse) or error string.
     */
    public ResponseEntity<?> loginTenant(TenantLoginRequest loginRequest){

        Tenant tenant = tenantRepo.findByEmail(loginRequest.getEmail());

        // Validate account existence via email
        if(tenant == null){
            return ResponseEntity.badRequest().body("Email not found!");
        }

        // Validate credentials match
        if(!tenant.getPassword().equals(loginRequest.getPassword())){
            return ResponseEntity.badRequest().body("Incorrect password!");
        }

        // ✅ Return only safe fields — never send password back to frontend
    TenantLoginResponse response = new TenantLoginResponse(
        tenant.getResidentId(),   // Maps residentId to tenantId in DTO
        tenant.getFullName(),  // Full Name
        tenant.getEmail()      //email
    );

        return ResponseEntity.ok(response);

    }

}
