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
    @NotBlank
    @Pattern(regexp = "^(\\+84|0)[3|5|7|8|9][0-9]{8}$", message = "Invalid phone number format")
    private String phoneNumber;
    private String firstName;
    private String lastName;
    @Past(message = "Date of birth must be in the past")
    private Date dob;
    private Boolean gender;
    private String password;
    private String address;
    private String banking;
    @Email(message = "Email should be valid")
    private String email;
    private int roleId;
    private boolean active;
}
