package org.gr1fpt.childvaccinescheduletrackingsystem.repository;

import jakarta.validation.constraints.Min;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking,String> {
    long countByCustomer_CustomerId(String customerId);
    List<Booking> findByCustomer_CustomerId(String customerId);
    List<Booking> findByStatus(int status);
}
