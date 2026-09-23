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

/*
    REST Controller responsible for handling HTTP requests related to Property Owners.
    
    Serves as the presentation/API layer that exposes endpoints for Recact/Vite frontend
*/

@RestController //Combines @Controller and @ResponseBody: serializes return values directly into HTTP JSON responses
@RequiredArgsConstructor //Lombok annotation: Automatically creates a constructor for all 'final' fields (enables Constructor Injection)
@RequestMapping("/owner") //Base URI path mapping for all endpoints defined in this controller
public class OwnerController{

    /*
        Dependency on the OwnerService business logic layer. 
        Marked 'final' so Lombok's @RequiredArgsConstructor generates the constructor injection automatically.
    */
    private final OwnerService ownerService ;

    /*
        Register a new Owner.
        Endpoint: POST http://localhost:8081/owner
    */
    @PostMapping
    public ResponseEntity<Owner> saveOwner(@RequestBody Owner owner){
        // @RequestBody instructs Spring to deserialize the incoming JSON request payload into an Owner Java object
        return ownerService.saveOwner(owner);
    }
    /*
        Retrieve a list of all Property Owners.
        Endpoint: GET http://localhost:8081/owner

        @return ResponseEntity wraping a list of all Owners and HTTP 200 OK status.
    */
    @GetMapping
    public ResponseEntity<List<Owner>>getAllOwners(){
        return ownerService.getAllOwners();
    }

    /*
    Retrieve a specific owner by their Unique ID.
    Endpoint: GET http://localhost:8080/owner/{owner_id}
    @param owner_id The primary key extracted directly from the URL path.
    @return ResponseEntity containing the found Owner or appropriate status
    */
    @GetMapping("/{owner_id}")
    public ResponseEntity<Owner> getOwnerById(@PathVariable Long owner_id){
        //@PathVariable extracts the path template variable {owner_id} from the URI into the method argument
        return ownerService.getOwnerById(owner_id);
    }

    /*
    Update an existing Owner's details.
    Endpoint: PUT http://localhost:8080/owner/{owner_id}

    @param owner_id ID of the target owner to update.
    @param owner Update owner field values sent via JSON payload.
    @return ResponseEntity containing the updated Owner object
    */
    @PutMapping("/{owner_id}")
    public ResponseEntity<Owner>updateOwner(@PathVariable Long owner_id ,@RequestBody Owner owner){ 
        // Receives both the target ID from the URL path and updated data payload from the request body
        return ownerService.updateOwner(owner_id,owner);
    }

    /**
     * Delete an Owner record by ID.
     * 
     * Endpoint: DELETE http://localhost:8080/owner/{owner_id}
     * 
     * @param owner_id ID of the owner to be removed.
     * @return ResponseEntity containing a confirmation message string.
     */
    @DeleteMapping("/{owner_id}")
    public ResponseEntity<String> deleteOwner(@PathVariable Long owner_id ){
        System.out.println("DELETE API HIT"); 
        return ownerService.deleteOwner(owner_id);
    }

    /**
     * Authenticate an Owner during login.
     * 
     * Endpoint: POST http://localhost:8080/owner/ownerlogin
     * 
     * @param loginRequest DTO containing credentials (email and password).
     * @return ResponseEntity with generic wild-card type (?) allowing flexible response payloads (e.g., Success object or Error message).
     */
    @PostMapping("/ownerlogin")
    public ResponseEntity<?> loginOwner(@RequestBody OwnerLoginRequest loginRequest) {
        
        return ownerService.loginOwner(loginRequest);
    }
    

} 