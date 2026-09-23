package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Owner;

/*
    Data Access Layer (DAO) interface for the {@link Owner} entity

    By extending JpaRepository, Spring Data JPA automatically generates standard CRUD 
    database implementation code at runtime.
*/


@Repository //Marks this interface as a Spring Data Repository component managed by Spring Dependency Injection
public interface OwnerRepo extends JpaRepository<Owner, Long> {

    /*
        Custom derived query method to fetch an owner by their email address.

        How Spring Data JPA works behind the scenes:
        -Spring parse the method name "findByEmail".
        -It recognizes "findBy" as a query action and "Email" as the target property on the owner entity.
        -It automatically generates the SQL query:
        "SELECT * FROM Owner WHERE email = ?"
    */
    Owner findByEmail(String email);
}