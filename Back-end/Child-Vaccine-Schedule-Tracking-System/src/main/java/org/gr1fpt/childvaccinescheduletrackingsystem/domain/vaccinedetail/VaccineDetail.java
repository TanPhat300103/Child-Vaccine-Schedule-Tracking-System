package org.gr1fpt.childvaccinescheduletrackingsystem.domain.vaccinedetail;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.vaccine.Vaccine;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "VaccineDetail")
public class VaccineDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vaccineId", nullable = false)
    private Vaccine vaccine;
    @NotNull(message = "Entry date cannot be null")
    private java.sql.Date entryDate;
    @NotNull(message = "Expired date cannot be null")
    private java.sql.Date expiredDate;
    private boolean status;
    private String img;
    private int day;
    private int tolerance;
    @Min(value = 0, message = "Quantity must be greater than 0")
    private int quantity;

}
