package com.example.demo.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.GenerationType;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "owner")

public class Owner {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "owner_id")
    private Long ownerId;

    @Column(name = "full_name",length = 100)
    private String fullName;

    @Column(name = "national_id",length = 50)
    private String nationalId;

    @Column(name = "phone_number",length = 100)
    private String phoneNumber;

    @Column(name = "email",length = 100)
    private String email;

    @Column(name = "address",length = 100)
    private String address;

    @Column(name = "password",length = 30)
    private String password;




}
