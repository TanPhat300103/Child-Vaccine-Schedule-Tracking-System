package org.gr1fpt.childvaccinescheduletrackingsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity
@Table(name = "Booking")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Booking {
    @Id
    private String bookingId;
    private Date bookingDate;
    @ManyToOne
    @JoinColumn(name = "customerId", nullable = false)
    @NotNull(message = "Customer Id cannot be null")
    private Customer customer;
    @Min(value = 0,message = "Invalid status")
    private int status;
    //booked inprocess complete cancled
    @Min(value = 0,message = "Amount must be greater than 0")
    private int totalAmount;

}
