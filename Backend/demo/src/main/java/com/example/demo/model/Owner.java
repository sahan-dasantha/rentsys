package com.example.demo.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*
    Represents a property owner in the Home rent system
    This class serves as a JPA Entity mapped to the "owner" table in the database.
    It encapsulates property owner details and maintains a one to many relationship with properties.
*/

@Entity // Marks this class as a Jakarta persistence (JPA) Entity mapped to a database
        // table
@Getter // Lombok annotation: Automatically generates getter methods for all private
        // fields at compile time
@Setter // Lombok annotation: Automatically generates setter methods for all private
        // fields at compile time
@AllArgsConstructor // Lombok annotation: Automatically generates a constructor with all field
                    // parameters
@NoArgsConstructor // Lombok annotation: Automatically generates a default no-argument constructor
                   // (required by JPA)
@Table(name = "owner") // Maps this entity specifically to the 'owner' database table

public class Owner {

  /*
   * Primary key for the owner table
   * Uses IDENTITY genaration strategy (auto-increment in MySQL/PostgreSQL)
   */

  @Id // Marks this field as the primary key of the table
  @GeneratedValue(strategy = GenerationType.IDENTITY) // Relies on database' auto-increment column feature
  @Column(name = "owner_id") // Maps this java field to the 'owner_id' database column
  private Long ownerId;

  // Full name of the property owner
  @Column(name = "full_name", length = 100) // Restricts column length to 100 charactors in the database schema
  private String fullName;

  // National identification number
  @Column(name = "national_id", length = 50)
  private String nationalId;

  // Contact phone number
  @Column(name = "phone_number", length = 100)
  private String phoneNumber;

  // Email address used for communication and account login.
  @Column(name = "email", length = 100)
  private String email;

  // Residential address of the owner
  @Column(name = "address", length = 100)
  private String address;

  // Account password
  @Column(name = "password", length = 30)
  private String password;

  /*
   * Relationship Mapping: One owner can own multiple properties.
   * - mappedBy = "owner": Indicates that the 'property' entity owns the foreign
   * key relationship.
   * The field named 'owner' in the Property class manages the database join
   * column
   * 
   * - cascade = CascadeType.ALL: Performs all persistence operations (PERSIST,
   * REMOVE REFRESH, MARGE)
   * transitively to child entities. Eg. Deleting an owner automatically deletes
   * all their properties.
   * 
   * - @JsonBackReference: Jackson annotation to prevent infinite recursion during
   * JSON serialization.
   * It makes this field as the 'child/back' side of the relationship so jackson
   * ignors it when converting an Owner instance to JSON.
   */

  @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
  @JsonBackReference
  private List<Property> properties; // One-to-Many relationship with Property entity

}
