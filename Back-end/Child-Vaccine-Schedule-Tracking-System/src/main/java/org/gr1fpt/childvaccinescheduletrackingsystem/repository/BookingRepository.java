package org.gr1fpt.childvaccinescheduletrackingsystem.repository;

import org.gr1fpt.childvaccinescheduletrackingsystem.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking,String> {
    long countByCustomer_CustomerId(String customerId);
}
