package com.example.demo.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tenant")

public class Tenant {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resident_id")
    private Long residentId;

    @Column(name = "full_name", length = 200)
    private String fullName;

    @Column(name = "national_id", length = 50)
    private String nationalId;

    @Column(name = "phone_number", length = 100)
    private String phoneNumber;

    @Column(name = "email", length = 200)
    private String email;

    @Column(name = "occupation", length = 100)
    private String occupation;

    @Column(name = "date_registered")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateRegistered;

    @Column(name = "password", length = 100)
    private String password;

}
