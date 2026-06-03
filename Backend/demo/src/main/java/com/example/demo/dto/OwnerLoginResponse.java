package com.example.demo.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor  // ← generates a constructor with all fields
public class OwnerLoginResponse {
    private Long ownerId;
    private String fullName;
    private String email;
    // ✅ no password field
}