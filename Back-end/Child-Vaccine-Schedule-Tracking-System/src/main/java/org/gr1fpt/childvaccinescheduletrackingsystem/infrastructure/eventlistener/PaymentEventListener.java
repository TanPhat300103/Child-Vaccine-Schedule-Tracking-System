package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.eventlistener;

import jakarta.mail.MessagingException;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.email.EmailService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.payment.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.sql.Date;

@Component
public class PaymentEventListener {

    @Autowired
    EmailService emailService;

    @EventListener
    public void senEmailPayment(Payment payment) throws MessagingException {
        int total = payment.getTotal();
        String transactionId = payment.getTransactionId();
        Date date = payment.getDate();
        boolean method = payment.isMethod();
        String to = payment.getBooking().getCustomer().getEmail();
        String customerName = payment.getBooking().getCustomer().getLastName()+" "+payment.getBooking().getCustomer().getFirstName();
        String customerCode = "KH"+payment.getBooking().getCustomer().getCustomerId();
        String address = payment.getBooking().getCustomer().getAddress();
        emailService.senPaymentEmail(to,customerName,date,total,transactionId,method,customerCode,address);
    }

}
