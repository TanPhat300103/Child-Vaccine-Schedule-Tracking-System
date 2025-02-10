package org.gr1fpt.childvaccinescheduletrackingsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Customer customer;
    private String firstName;
    private String lastName;
    private Boolean gender;
    private java.sql.Date dob;
    private String contraindications;
    private Boolean active;
}
