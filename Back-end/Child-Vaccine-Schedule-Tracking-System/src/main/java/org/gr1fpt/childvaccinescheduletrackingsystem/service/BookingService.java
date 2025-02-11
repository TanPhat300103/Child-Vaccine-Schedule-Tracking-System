package org.gr1fpt.childvaccinescheduletrackingsystem.service;

import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Booking;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.BookingRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public String generateId(String customerId) {
        long count = bookingRepository.countByCustomer_CustomerId(customerId) + 1;
        return customerId + "-B" + count;
    }

    public Booking saveBooking(Booking booking) {
        if(customerRepository.findById(booking.getCustomer().getCustomerId()).isPresent()) {
            booking.setBookingId(generateId(booking.getCustomer().getCustomerId()));
          return bookingRepository.save(booking);
        }


        else throw new CustomException("Customer Id " + booking.getCustomer().getCustomerId()+" does not exist", HttpStatus.BAD_REQUEST);
    }
}
