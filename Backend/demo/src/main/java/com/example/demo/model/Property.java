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

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "property")
public class Property {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "property_id")
    private Long propertyId;

    @Column(name = "address", length = 200)
    private String address;

    @Column(name = "type", length = 50)
    private String type;        //house,apartment,villa
    
    @Column(name = "rent_amount")
    private Double rentAmount;   

    @Column(name = "status", length = 20)
    private String status;  //available,occupied

    @ManyToOne
    @JoinColumn(name = "owner_id")
    @JsonBackReference
    private Owner owner;
}
