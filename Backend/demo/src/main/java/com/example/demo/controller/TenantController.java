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



@RestController
@RequiredArgsConstructor
@RequestMapping("/tenant")
public class TenantController {
    
    private final TenantService tenantService;

    //post Request
    @PostMapping
    public ResponseEntity<Tenant> saveTenant(@RequestBody Tenant tenant){
        return tenantService.saveTenant(tenant);
    }

    //get request
    @GetMapping
    public ResponseEntity<List<Tenant>>getAllTenants(){
        return tenantService.getAllTenants();
        
    }

    //get through id
    @GetMapping("/{tenant_id}")
    public ResponseEntity<Tenant>getTenantById(@PathVariable Long tenant_id){
        return tenantService.getTenantById(tenant_id);
    }

    //Put Mapping
    @PutMapping("/{tenant_id}")
    public ResponseEntity<Tenant>updateTenant(@PathVariable Long tenant_id, @RequestBody Tenant tenant){//geting the tenant id that sould be passed and the tenant that should be updated
        return tenantService.updateTenant(tenant_id, tenant);
    }

    //delete method
    @DeleteMapping("/{tenant_id}")
    public ResponseEntity<String> deleteTenant(@PathVariable Long tenant_id){
        return tenantService.deleteTenant(tenant_id);
    } 

    //Owner login API
    @PostMapping("/tenantlogin")
    public ResponseEntity<?> loginTenant(@RequestBody TenantLoginRequest loginRequest) {
        
        return tenantService.loginTenant(loginRequest);
    }
}
