package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.dto.OwnerLoginRequest;
import com.example.demo.model.Owner;
import com.example.demo.repository.OwnerRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class OwnerService {

    private final OwnerRepo ownerRepo;

    //post method 
    public ResponseEntity<Owner> saveOwner(Owner owner) {
        owner = ownerRepo.save(owner);
        
        if (owner.getOwnerId() == null){
               throw new RuntimeException("Owner save request is failed!"); 
        } else{
            return ResponseEntity.ok(owner);
        }  
 }

    //get method
    public ResponseEntity<List<Owner>> getAllOwners() {
        
        List<Owner> ownerList = ownerRepo.findAll();
        return ResponseEntity.ok(ownerList);
    }

    //get owner by id method
    public ResponseEntity<Owner> getOwnerById(Long owner_id) {
        if(owner_id == null){   //checking whether the id is null or not
            throw new RuntimeException("Owner Id is required!");
        }else{
            Optional<Owner> optOwner = ownerRepo.findById(owner_id);
            if(optOwner.isPresent()){
                return ResponseEntity.ok(optOwner.get());
            }else{
                throw new RuntimeException("Data not found for given owner id!");
            }
        }
    }
    //updating owner method
    public ResponseEntity<Owner> updateOwner(Long owner_id, Owner owner) {
        if(owner_id == null){  //checking whether the id is null or not
            throw new RuntimeException("Owner id is required!");
        }else{
            Optional<Owner> optOwner = ownerRepo.findById(owner_id);
            if(optOwner.isPresent()){

                Owner ownerUpdateObj = optOwner.get();  //creating owner object to add new data

                // Only update if value is provided
            if(owner.getFullName() != null)     ownerUpdateObj.setFullName(owner.getFullName());
            if(owner.getNationalId() != null)   ownerUpdateObj.setNationalId(owner.getNationalId());
            if(owner.getPhoneNumber() != null)  ownerUpdateObj.setPhoneNumber(owner.getPhoneNumber());
            if(owner.getEmail() != null)        ownerUpdateObj.setEmail(owner.getEmail());
            if(owner.getAddress() != null)      ownerUpdateObj.setAddress(owner.getAddress());
            if(owner.getPassword() != null)     ownerUpdateObj.setPassword(owner.getPassword());

                ownerUpdateObj = ownerRepo.save(ownerUpdateObj);  //save new data in the database

                return ResponseEntity.ok(ownerUpdateObj);


            }else{
                throw new RuntimeException("Data not found for given owner id!");
            }
        }
    }

    //delete owner method
    public ResponseEntity<String> deleteOwner(Long owner_id) {
         if(owner_id == null){  //checking whether the id is null or not
            throw new RuntimeException("Owner id is required!");
        }else{
            Optional<Owner> optOwner = ownerRepo.findById(owner_id);
            if(optOwner.isPresent()){
                ownerRepo.deleteById(owner_id);
                return ResponseEntity.ok("Owner was deleted.");
            }else{
                throw new RuntimeException("Data not found for given owner id!");
            }
        }
        
    }

    //Owner login method
    public ResponseEntity<?> loginOwner(OwnerLoginRequest loginRequest){

        Owner owner = ownerRepo.findByEmail(loginRequest.getEmail());

        //check email
        if(owner == null){
            return ResponseEntity.badRequest().body("Email not found!");
        }

        //check password
        if(!owner.getPassword().equals(loginRequest.getPassword())){
            return ResponseEntity.badRequest().body("Incorrect password!");
        }

        return ResponseEntity.ok(owner);

    }
    
}
