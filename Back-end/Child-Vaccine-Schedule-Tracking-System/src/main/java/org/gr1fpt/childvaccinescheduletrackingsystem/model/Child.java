package org.gr1fpt.childvaccinescheduletrackingsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name ="Child")
public class Child {
    @Id
    private String childId;
    @ManyToOne
    @JoinColumn(name = "customerId", nullable = false)
    @NotNull(message = "Customer Id cannot be null")
    private Customer customer;
    private String firstName;
    private String lastName;
    private Boolean gender;
    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private Date dob;
    private String contraindications;
    private boolean active;



    //done validation
}
