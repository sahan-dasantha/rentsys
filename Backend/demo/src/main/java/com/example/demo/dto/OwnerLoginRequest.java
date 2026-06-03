package com.example.demo.dto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class OwnerLoginRequest {

    private String email;    // receives email from React
    private String password; // receives password from React
}
