package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.booking;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.booking.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking,String> {
    long countByCustomer_CustomerId(String customerId);
    List<Booking> findByCustomer_CustomerId(String customerId);
    List<Booking> findByStatus(int status);
    List<Booking> findByBookingDate(Date bookingDate);
}
