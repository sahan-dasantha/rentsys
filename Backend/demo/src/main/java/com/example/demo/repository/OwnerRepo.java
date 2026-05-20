package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Owner;



//Remove @RepositoryRestResource below to disable auto REST api:
@Repository
public interface OwnerRepo extends JpaRepository<Owner, Long>{
    Owner findByEmail(String email);
}