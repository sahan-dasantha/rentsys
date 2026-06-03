package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TenantLoginRequest {
    private String email;
    private String password;
}
