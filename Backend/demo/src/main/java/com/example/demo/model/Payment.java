package com.example.demo.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity //Marks this class as a Jakarta persistence (JPA) entity mapped to a database table
@Getter //Lombok annotation: Automatically generates getter methods for all private fields at compile time
@Setter ////Lombok annotation: Automatically generates getter methods for all private fields at compile time
@AllArgsConstructor //Lombok annotation: Automatically generates a constructor with all field parameters
@NoArgsConstructor //Lombok annotation: Automatically generates a default no-argument constructor (required by JPA)
@Table(name = "payment") //Maps this entity specifically to the 'payment' database table

public class Payment {
    @Id //Marks this field as the primary key of the table
    @GeneratedValue (strategy = GenerationType.IDENTITY) //Relies on database' auto-increment column feature
    @Column (name = "payment_id") //Maps this java field to the 'payment_id' database column
    private Long paymentId;

    @Column (name = "agreement_id")
    private Long agreementId; //links to which agreement
    
    @Column (name = "resident_id")
    private Long residentId; //which tenant

    @Column (name = "property_id")
    private Long propertyId; //which property

    @Column (name = "payment_month")
    private String paymentMonth; //Month that the payment was done

    @Column (name = "amount")
    private Double amount; //Monthly rent amount

    @Column (name = "due_date")
    private LocalDate dueDate; //due date that payment should be done

    @Column (name = "payment_date")
    private LocalDate paymentDate; //date, tenant actually paid

    @Column (name = "receipt_path")
    private String receiptPath; //PDF file path on server

    @Column (name = "status")
    private String status; //"UNPAID" / "PENDING_CONFIRMATION" / "PAID"

    // Automatically called by JPA before inserting a new row
    // Sets default status to UNPAID when payment record is first created
    @PrePersist 
    public void prePersist() {
        this.status = "UNPAID";
    }
}
