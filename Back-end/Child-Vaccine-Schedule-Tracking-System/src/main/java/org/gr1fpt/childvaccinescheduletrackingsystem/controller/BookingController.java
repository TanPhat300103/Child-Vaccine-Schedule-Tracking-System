package org.gr1fpt.childvaccinescheduletrackingsystem.controller;

import jakarta.validation.Valid;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Booking;
import org.gr1fpt.childvaccinescheduletrackingsystem.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("booking")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PostMapping("create")
    public Booking createBooking(@RequestBody @Valid Booking booking) {
        return bookingService.saveBooking(booking);
    }


}
