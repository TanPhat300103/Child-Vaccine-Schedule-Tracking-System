package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.payment;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.payment.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,String> {
    public Payment findByTransactionId(String transactionId);
    public Payment findByBooking_BookingId(String bookingId);


}
