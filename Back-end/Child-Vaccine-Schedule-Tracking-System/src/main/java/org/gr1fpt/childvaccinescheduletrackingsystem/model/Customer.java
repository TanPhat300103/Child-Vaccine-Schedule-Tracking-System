package org.gr1fpt.childvaccinescheduletrackingsystem.model;

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
@Table(name = "Customer") // Chỉ định tên bảng là 'Human'
public class Customer {
    @Id
    private String customerId;
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone should be valid")
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private Date dob;
    private Boolean gender;
    private String password;
    private String address;
    private String banking;
    @Email(message = "Email should be valid")
    private String email;
    @Min(value = 1,message = "Invalid Id")
    @Max(value = 3,message = "Invalid Id")
    private int roleId;
    private boolean active;
}
