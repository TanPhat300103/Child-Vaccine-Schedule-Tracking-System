package org.gr1fpt.childvaccinescheduletrackingsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name ="ComboDetail")
public class ComboDetail {

    @Id
    private String comboDetailId;
    @ManyToOne
    @JoinColumn(name = "vaccineComboId")
    private VaccineCombo vaccineCombo;

    @ManyToOne
    @JoinColumn(name = "vaccineId")
    private Vaccine vaccine;
}
