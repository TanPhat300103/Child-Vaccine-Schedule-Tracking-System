package org.gr1fpt.childvaccinescheduletrackingsystem.role;

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
@Table(name ="Role")
public class Role {
    @Id
    @Min(value = 1,message = "Invalid Id")
    @Max(value = 3,message = "Invalid Id")
    private int roleId;
    //1 customer
    //2 staff
    //3 admin
    private String roleName;
}
