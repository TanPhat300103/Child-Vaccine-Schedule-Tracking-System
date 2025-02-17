package org.gr1fpt.childvaccinescheduletrackingsystem.feedback;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.gr1fpt.childvaccinescheduletrackingsystem.booking.Booking;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Feedback")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NotNull
    private int id;

    @ManyToOne
    @JoinColumn(name = "bookingId",nullable = false)
    @NotNull(message = "Booking Id cannot be null")
    Booking booking;

    @Min(value = 0,message = "Ranking is greater than 0")
    @Max(value = 5,message = "Ranking is less than 5")
    private int ranking;

    private String comment;

}
