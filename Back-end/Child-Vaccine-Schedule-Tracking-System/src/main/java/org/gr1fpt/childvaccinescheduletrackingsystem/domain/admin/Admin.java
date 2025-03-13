package org.gr1fpt.childvaccinescheduletrackingsystem.domain.admin;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Admin")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Admin {
    @Id
    private String adminId;
    private String firstName;
    private String lastName;
    @NotBlank(message = "Phone number cannot be empty")
    @Pattern(regexp = "^(\\+84|0)[3|5|7|8|9][0-9]{8}$", message = "Invalid phone number format")
    private String phone;
    @Email(message = "Email should be valid")
    private String mail;
    private String password;
    @Min(value = 1,message = "Invalid Id")
    @Max(value = 3,message = "Invalid Id")
    private int roleId;
    private boolean active;

}
