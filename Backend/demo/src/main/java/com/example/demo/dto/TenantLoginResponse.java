package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor

public class TenantLoginResponse {
    private Long residentId;
    private String fullName;
    private String email;
}
