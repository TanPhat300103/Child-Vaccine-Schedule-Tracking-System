package org.gr1fpt.childvaccinescheduletrackingsystem.model;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookingDTO {
    @Valid
    private Booking booking;
    private List<String> vaccineId;
    private Child child;
    private List<String> vaccineComboId;


}
