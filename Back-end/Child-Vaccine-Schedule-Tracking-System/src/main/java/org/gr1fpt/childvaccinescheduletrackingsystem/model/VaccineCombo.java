package org.gr1fpt.childvaccinescheduletrackingsystem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "VaccineCombo")
public class VaccineCombo {
    @Id
    private String vaccineComboId;
    private String name;
    private String description;
    private boolean active;
}
