package org.gr1fpt.childvaccinescheduletrackingsystem.medicalhistory;

import jakarta.persistence.*;
import lombok.*;
import org.gr1fpt.childvaccinescheduletrackingsystem.child.Child;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccine.Vaccine;

import java.sql.Date;

@Entity
@Table(name = "MedicalHistory")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class MedicalHistory {
    @Id
    private String medicalHistoryId;
    @ManyToOne
    @JoinColumn(name = "childId", nullable = false)
    private Child child;
    @ManyToOne
    @JoinColumn(name = "vaccineId", nullable = false)
    private Vaccine vaccine;
    private Date date;
    private int dose;
    private String reaction;

}
