package org.gr1fpt.childvaccinescheduletrackingsystem.customer;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "Customer")
public class Customer {
    @Id
    private String customerId;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private Date dob;
    private Boolean gender;
    private String password;
    private String address;
    private String banking;
    private String email;
    private int roleId;
    private boolean active;
}
