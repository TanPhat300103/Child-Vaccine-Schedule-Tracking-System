package org.gr1fpt.childvaccinescheduletrackingsystem.combodetail;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccine.Vaccine;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccinecombo.VaccineCombo;

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
