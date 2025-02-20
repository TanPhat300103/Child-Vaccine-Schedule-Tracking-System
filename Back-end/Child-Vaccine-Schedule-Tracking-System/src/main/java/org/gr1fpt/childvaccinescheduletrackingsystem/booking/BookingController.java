package org.gr1fpt.childvaccinescheduletrackingsystem.booking;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("booking")
@CrossOrigin(origins = "*")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PostMapping("create")
    public Booking createBooking(@RequestBody @Valid BookingDTO bookingDTO) {
        System.out.println(bookingDTO.getVaccineId());
       return bookingService.saveBooking(bookingDTO);
    }

    @GetMapping("findbycustomer")
    public List<Booking> findBookingByCustomer(@RequestParam String customerId) {
        return bookingService.getBookingsByCustomerId(customerId);
    }

    @GetMapping("findbystatus")
    public List<Booking> findBookingByStatus(@RequestParam int status) {
        return bookingService.getBookingByStatus(status);
    }

    @GetMapping("findbyid")
    public Booking findBookingById(@RequestParam String id) {
        return bookingService.getBookingById(id);
    }

    @PostMapping("setstatus")
    public void setBookingStatus(@RequestParam String bookingId, @RequestParam int status) {
        bookingService.setStatus(status,bookingId);
    }

    @PostMapping("update")
    public Booking updateBooking(@RequestBody @Valid Booking booking) {
        return bookingService.updateBooking(booking);
    }

    @DeleteMapping("delete")
    public void deleteBooking(@RequestParam String id)
    {
        bookingService.delete(id);
    }
}
