package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.example.demo.dto.OwnerLoginResponse;

import com.example.demo.dto.OwnerLoginRequest;
import com.example.demo.model.Owner;
import com.example.demo.repository.OwnerRepo;

import lombok.RequiredArgsConstructor;

/**
 * Service class containing business logic for Owner management and authentication.
 * 
 * Acts as the intermediate layer between the API Controller (http requests) 
 * and the Database Repository (data access).
 */
@Service // Marks this class as a Spring Service component managed by Spring's Dependency Injection container
@RequiredArgsConstructor //Lombok Annotation: Generates a constructor for all 'final' fields (Constructor Injection)

public class OwnerService {

    //Injected Repository dependency to execute CRUD queries on the 'owner' table.
    private final OwnerRepo ownerRepo;

    /**
     * Saves a new owner record into the database.
     * 
     * @param owner The owner object containing new registration details.
     * @return ResponseEntity wrapping the newly saved Owner with an assigned auto-increment ID.
     */
    public ResponseEntity<Owner> saveOwner(Owner owner) {
        owner = ownerRepo.save(owner);
        
        if (owner.getOwnerId() == null){
            throw new RuntimeException("Owner save request is failed!"); 
        } else{
            return ResponseEntity.ok(owner); // HTTP 200 OK with the saved owner JSON payload
        }  
 }

    /**
     * Retrieves all owners registered in the database.
     * 
     * @return ResponseEntity wrapping a list of all Owner entities.
     */
    public ResponseEntity<List<Owner>> getAllOwners() {
        
        List<Owner> ownerList = ownerRepo.findAll();
        return ResponseEntity.ok(ownerList);
    }

    /**
     * Fetches a specific owner by their primary key ID.
     * 
     * @param owner_id The primary key of the owner.
     * @return ResponseEntity wrapping the matching Owner entity.
     * @throws RuntimeException if ID is null or owner is not found.
     */
    public ResponseEntity<Owner> getOwnerById(Long owner_id) {
        if(owner_id == null){   //checking whether the id is null or not
            throw new RuntimeException("Owner Id is required!");
        }else{
            // Optional wrapper prevents direct NullPointerException when fetching missing database records
            Optional<Owner> optOwner = ownerRepo.findById(owner_id);

            if(optOwner.isPresent()){
                return ResponseEntity.ok(optOwner.get()); // Extracts the Owner object from Optional wrapper
            }else{
                throw new RuntimeException("Data not found for given owner id!");
            }
        }
    }
    
    /**
     * Performs a partial or full update on an existing owner's record.
     * 
     * @param owner_id ID of the owner to be updated.
     * @param owner Data object containing new/updated fields.
     * @return ResponseEntity containing the updated Owner entity.
     */
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

    /**
     * Removes an owner record from the database by ID.
     * 
     * @param owner_id Primary key ID of the target owner to remove.
     * @return ResponseEntity wrapping a success message string.
     */
    public ResponseEntity<String> deleteOwner(Long owner_id) {
         if(owner_id == null){  //checking whether the id is null or not
            throw new RuntimeException("Owner id is required!");
        }else{
            Optional<Owner> optOwner = ownerRepo.findById(owner_id);
            if(optOwner.isPresent()){
                ownerRepo.deleteById(owner_id); // Executes SQL DELETE FROM owner WHERE owner_id = ?
                return ResponseEntity.ok("Owner was deleted.");
            }else{
                throw new RuntimeException("Data not found for given owner id!");
            }
        }
        
    }

    /**
     * Authenticates an owner based on email and password credentials.
     * 
     * @param loginRequest DTO holding incoming email and password from React login form.
     * @return ResponseEntity containing OwnerLoginResponse DTO upon success or error message string upon failure.
     */
    public ResponseEntity<?> loginOwner(OwnerLoginRequest loginRequest){

        // Query database by unique email address
        Owner owner = ownerRepo.findByEmail(loginRequest.getEmail());

        // Step 1: Validate email existence
        if(owner == null){
            return ResponseEntity.badRequest().body("Email not found!");
        }

        // Step 2: Validate password match (Plain text comparison)
        if(!owner.getPassword().equals(loginRequest.getPassword())){
            return ResponseEntity.badRequest().body("Incorrect password!");
        }

        
        // Step 3: Map entity to a safe Response DTO (omitting sensitive fields like password)
        OwnerLoginResponse response = new OwnerLoginResponse(
            owner.getOwnerId(),   // Long ownerId
            owner.getFullName(),  // String fullName
            owner.getEmail()      // String email
    );

        return ResponseEntity.ok(response); // Returns HTTP 200 OK with sanitized login payload

    }
    
}
