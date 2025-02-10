package org.gr1fpt.childvaccinescheduletrackingsystem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "Vaccine")
public class Vaccine {
    @Id
    private String vaccineId;
    private String name;
    @Min(value =1, message ="Invalid dose")
    private int doseNumber;
    private String description;
    private String country;
    @Min(value =1, message ="Invalid age")
    @Max(value = 99,message = "Invalid age")
    private int ageMin;
    @Min(value =1, message ="Invalid age")
    @Max(value = 99,message = "Invalid age")
    private int ageMax;
    private boolean active;
    private int price;
}
