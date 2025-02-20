package org.gr1fpt.childvaccinescheduletrackingsystem.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,String> {
    public Payment findByTransactionId(String transactionId);
    public Payment findByBooking_BookingId(String bookingId);

}
