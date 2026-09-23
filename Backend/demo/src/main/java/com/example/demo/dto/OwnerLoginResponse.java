package com.example.demo.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Data Transfer Object (DTO) for returning Owner authentication details to the client.
 * 
 * Sent back to the React/Vite frontend upon successful login verification.
 * It encapsulates basic user session details while strictly omitting sensitive data
 * such as hashed passwords or internal database relationship graphs.
 */
@Getter // Lombok annotation: Generates getter methods so Jackson can serialize private fields into JSON
@AllArgsConstructor  // Lombok annotation: Generates a parameterized constructor containing all fields (ownerId, fullName, email)
public class OwnerLoginResponse {

    /**
     * Unique identifier of the logged-in owner.
     * Essential for the React frontend to store in state or local storage for subsequent API requests
     * (e.g., fetching properties belonging specifically to this owner ID).
     */
    private Long ownerId;

    /**
     * Display name of the owner for personalize UI greetings in React (e.g., "Welcome back, John!").
     */
    private String fullName;

    /**
     * Registered email address of the owner.
     */
    private String email;
    
    // Notice: Password and sensitive entity properties (e.g., properties list, national ID) 
    // are deliberately excluded to adhere to the Least Privilege principle in security design.
}