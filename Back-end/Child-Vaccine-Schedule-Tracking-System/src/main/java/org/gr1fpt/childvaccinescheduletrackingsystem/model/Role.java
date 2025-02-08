package org.gr1fpt.childvaccinescheduletrackingsystem.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class Role {
    @Min(value = 1,message = "Invalid Id")
    @Max(value = 3,message = "Invalid Id")
    private int roleId;
    private String roleName;
}
