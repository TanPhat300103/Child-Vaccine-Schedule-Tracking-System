package org.gr1fpt.childvaccinescheduletrackingsystem.vaccinecombo;

import jakarta.persistence.*;
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
    @Column(name = "priceCombo")
    private int priceCombo;
}
