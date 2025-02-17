package org.gr1fpt.childvaccinescheduletrackingsystem.satff;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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
    @NotBlank(message = "Phone number cannot be empty")
    @Pattern(regexp = "^(\\+84|0)[3|5|7|8|9][0-9]{8}$", message = "Invalid phone number format")
    private String phone;

    @Past(message = "Date of birth must be in the past")
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
