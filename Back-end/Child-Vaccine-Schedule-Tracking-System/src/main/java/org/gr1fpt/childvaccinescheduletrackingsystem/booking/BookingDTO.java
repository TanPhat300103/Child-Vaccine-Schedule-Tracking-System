package org.gr1fpt.childvaccinescheduletrackingsystem.booking;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.gr1fpt.childvaccinescheduletrackingsystem.child.Child;

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
