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

/**
 * Represents a Tenant (Resident) seeking or renting homes in the Home Rental System.
 * 
 * Maps directly to the "tenant" table in the database using Jakarta Persistence (JPA).
 */
@Entity //Marks this class as a JPA entity managed by Hibernate/Spring Data JPA
@Getter // Lombok: Generates getter methods for all private fields automatically
@Setter // Lombok: Generates setter methods for all private fields automatically
@AllArgsConstructor // Lombok: Generates a constructor with all arguments
@NoArgsConstructor // Lombok: Generates a mandatory default zero-argument constructor required by JPA
@Table(name = "tenant") // Explicitly names the target database table "tenant"

public class Tenant {
    
    /**
     * Primary Key for the tenant table.
     * Managed by auto-increment generation strategy in the database.
     */
    @Id //Marks this field as the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Delegates auto-incrementing to the database (e.g., MySQL AUTO_INCREMENT)
    @Column(name = "resident_id") //Maps field to column "resident_id" inthe schema
    private Long residentId;

    //Tenant's full name
    @Column(name = "full_name", length = 200)
    private String fullName;

    //NIC number
    @Column(name = "national_id", length = 50)
    private String nationalId;

    //Contact phone number
    @Column(name = "phone_number", length = 100)
    private String phoneNumber;

    //Email address used for authentication and communication
    @Column(name = "email", length = 200)
    private String email;

    //Tenant's current occupation/profession.
    @Column(name = "occupation", length = 100)
    private String occupation;

    /**
     * The date the tenant registered on the platform.
     * 
     * - LocalDate: Modern Java 8 date representation without time or time-zone information.
     * - @JsonFormat: Configures Jackson to serialize/deserialize this date to/from "YYYY-MM-DD" JSON string format
     *   (e.g., "2026-09-11"), which matches standard HTML date inputs (<input type="date" />) in React.
     */
    @Column(name = "date_registered")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateRegistered;

    /**
     * Account password.
     * NOTE: Storing plain-text passwords is a security risk. In production, this should be hashed (e.g., using BCrypt).
     */
    @Column(name = "password", length = 100)
    private String password;

}
