package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
            throw new RuntimeException("Tenant request is failed");
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
            throw new RuntimeException("Tenant id is required");
        }else{
            Optional<Tenant> optTenant = tenantRepo.findById(tenant_id);
            if(optTenant.isPresent()){
                return ResponseEntity.ok(optTenant.get());
            }else{
                throw new RuntimeException("Data not found for given owner id");
            }
        }
    }
}
