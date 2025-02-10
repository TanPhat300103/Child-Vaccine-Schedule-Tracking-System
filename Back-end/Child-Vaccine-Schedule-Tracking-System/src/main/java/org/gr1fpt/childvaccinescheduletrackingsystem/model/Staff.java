package org.gr1fpt.childvaccinescheduletrackingsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name ="Staff")
public class Staff {
    @Id
    private String staffId;
    private String firstName;
    private String lastName;
    private String phone;
    private Date dob;
    private String address;
    @Email(message = "Email should be valid")
    private String mail;
    private String password;
    @Min(value = 1,message = "Invalid Id")
    @Max(value = 3,message = "Invalid Id")
    private int roleId;
    private boolean active;
}
