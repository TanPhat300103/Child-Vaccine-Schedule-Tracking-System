package org.gr1fpt.childvaccinescheduletrackingsystem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name ="Role")
public class Role {
    @Id
    @Min(value = 1,message = "Invalid Id")
    @Max(value = 3,message = "Invalid Id")
    private int roleId;
    private String roleName;
}
