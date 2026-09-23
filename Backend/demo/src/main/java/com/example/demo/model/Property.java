package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
/**
 * Represents a Property listed for rent in the Home Rental System.
 * 
 * Maps directly to the "property" database table and maintains a 
 * Many-To-One relationship with the property Owner.
 */
@Entity // Marks this class as a JPA entity managed by Hibernate/Spring Data JPA
@Getter // Lombok: Automatically generates getter methods for all private fields
@Setter // Lombok: Automatically generates setter methods for all private fields
@AllArgsConstructor // Lombok: Generates a constructor accepting all arguments
@NoArgsConstructor // Lombok: Generates a mandatory default zero-argument constructor required by JPA
@Table(name = "property") // Specifies the target relational database table name
public class Property {
    /**
     * Primary Key for the property table.
     * Managed by auto-increment generation strategy in the database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_id")
    private Long propertyId;

    /**
     * Physical street address or location description of the rental unit.
     */
    @Column(name = "address", length = 200)
    private String address;

    /**
     * Category/Classification of the property (e.g., "House", "Apartment", "Villa").
     */
    @Column(name = "type", length = 50)
    private String type;        //house,apartment,villa
    
    /**
     * Monthly rental price charged to tenants.
     */
    @Column(name = "rent_amount")
    private Double rentAmount;   

    /**
     * Current availability status of the property (e.g., "Available", "Occupied", "Under Maintenance").
     */
    @Column(name = "status", length = 20)
    private String status;  //available,occupied

    /**
     * Many-To-One Relational Mapping to the Owner who listed this property.
     * 
     * - @ManyToOne: Specifies that many properties can belong to a single Owner.
     * - @JoinColumn: Configures "owner_id" as the foreign key column in the "property" table.
     * - @JsonBackReference: Prevents infinite recursion during Jackson JSON serialization.
     *   Pairs with @JsonManagedReference on the Owner entity's properties collection.
     */
    @ManyToOne
    @JoinColumn(name = "owner_id")
    @JsonBackReference
    private Owner owner;
}
