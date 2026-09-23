package com.example.demo.dto;
import lombok.Getter;
import lombok.Setter;

/**
 * Data Transfer Object (DTO) for handling Owner Login requests.
 * 
 * A DTO is a lightweight object designed solely to carry data between the client 
 * (React frontend) and the server (Spring Boot backend) without exposing full 
 * domain entity models (like {@link com.example.demo.model.Owner}).
 */
@Getter // Lombok annotation: Automatically generates getter methods (getEmail(), getPassword())
@Setter // Lombok annotation: Automatically generates setter methods (setEmail(), setPassword())

public class OwnerLoginRequest {

    /**
     * Email address entered by the owner in the login form.
     * Jackson automatically maps the JSON key {"email": "..."} to this field.
     */
    private String email;
     /**
     * Plain-text password entered by the owner in the login form.
     * Jackson automatically maps the JSON key {"password": "..."} to this field.
     */   
    private String password; 
}
