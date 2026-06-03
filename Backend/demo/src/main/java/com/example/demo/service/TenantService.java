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

@Service
@RequiredArgsConstructor

public class TenantService {
    
    private final TenantRepo tenantRepo;

    //post method
    public ResponseEntity<Tenant> saveTenant(Tenant tenant){
        tenant = tenantRepo.save(tenant);

        if(tenant.getResidentId() == null){
            throw new RuntimeException("Tenant request is failed!");
        }else{
            return ResponseEntity.ok(tenant);
        }
    }

    //get method
    public ResponseEntity<List<Tenant>> getAllTenants(){

        List<Tenant> tenantList = tenantRepo.findAll();
        return ResponseEntity.ok(tenantList);
    }

    //get by id method
    public ResponseEntity<Tenant> getTenantById(Long tenant_id){
        if(tenant_id == null){
            throw new RuntimeException("Tenant id is required!");
        }else{
            Optional<Tenant> optTenant = tenantRepo.findById(tenant_id);
            if(optTenant.isPresent()){
                return ResponseEntity.ok(optTenant.get());
            }else{
                throw new RuntimeException("Data not found for given owner id!");
            }
        }
    }

    //Updating method
    public ResponseEntity<Tenant> updateTenant(Long tenant_id, Tenant tenant){
        if(tenant_id == null){
            throw new RuntimeException("Tenant id is required!");
        }else{
            Optional<Tenant> optTenant = tenantRepo.findById(tenant_id);

            if(optTenant.isPresent()){

                Tenant tenantUpdateObj = optTenant.get(); //creating tenant object to add new data

                // Only update if value is provided
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

    //delete tenant method
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

    //Tenant login method
    public ResponseEntity<?> loginTenant(TenantLoginRequest loginRequest){

        Tenant tenant = tenantRepo.findByEmail(loginRequest.getEmail());

        //check email
        if(tenant == null){
            return ResponseEntity.badRequest().body("Email not found!");
        }

        //check password
        if(!tenant.getPassword().equals(loginRequest.getPassword())){
            return ResponseEntity.badRequest().body("Incorrect password!");
        }

        // ✅ Return only safe fields — never send password back to frontend
    TenantLoginResponse response = new TenantLoginResponse(
        tenant.getResidentId(),   // Long TenantId
        tenant.getFullName(),  // String fullName
        tenant.getEmail()      // String email
    );

        return ResponseEntity.ok(response);

    }

}
