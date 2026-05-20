package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.OwnerLoginRequest;
import com.example.demo.model.Owner;
import com.example.demo.service.OwnerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/owner")
public class OwnerController{

    private final OwnerService ownerService ;

    //Post Request
    @PostMapping
    public ResponseEntity<Owner> saveOwner(@RequestBody Owner owner){
        return ownerService.saveOwner(owner);
    }

    //Get request
    @GetMapping
    public ResponseEntity<List<Owner>>getAllOwners(){
        return ownerService.getAllOwners();
    }

    //get through Id
    @GetMapping("/{owner_id}")
    public ResponseEntity<Owner> getOwnerById(@PathVariable Long owner_id){
        return ownerService.getOwnerById(owner_id);
    }

    //Put Mapping
    @PutMapping("/{owner_id}")
    public ResponseEntity<Owner>updateOwner(@PathVariable Long owner_id ,@RequestBody Owner owner){ //geting the owner id that sould be passed and the owner that should be updated
         
        return ownerService.updateOwner(owner_id,owner);
    }

    //Delete method
    @DeleteMapping("/{owner_id}")
    public ResponseEntity<String> deleteOwner(@PathVariable Long owner_id ){
        System.out.println("DELETE API HIT"); 
        return ownerService.deleteOwner(owner_id);
    }

    //Owner login API
    @PostMapping("/ownerlogin")
    public ResponseEntity<?> loginOwner(@RequestBody OwnerLoginRequest loginRequest) {
        
        return ownerService.loginOwner(loginRequest);
    }
    

} 