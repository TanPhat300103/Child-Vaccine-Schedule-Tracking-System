package org.gr1fpt.childvaccinescheduletrackingsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "VaccineDetail")
public class VaccineDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "vaccineId", nullable = false)
    private Vaccine vaccine;
    private java.sql.Date entryDate;
    private java.sql.Date expiredDate;
    private boolean status;
    private String img;
    private int day;
    private int tolerance;
    private int quantity;

}
