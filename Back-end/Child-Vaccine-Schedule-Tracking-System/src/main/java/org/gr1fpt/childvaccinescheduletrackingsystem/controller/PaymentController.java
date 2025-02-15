package org.gr1fpt.childvaccinescheduletrackingsystem.controller;

import jakarta.validation.Valid;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Booking;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Payment;
import org.gr1fpt.childvaccinescheduletrackingsystem.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("payment")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @GetMapping()
    public List<Payment> getPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("findbyid")
    public Payment getPaymentById(@RequestParam String id) {
        return paymentService.getPaymentById(id);
    }

    @GetMapping("findbytransaction")
    public Payment getPaymentByTransaction(@RequestParam String transactionId) {
        return paymentService.getPaymentByTransactionId(transactionId);
    }

    @GetMapping("findbybooking")
    public Payment getPaymentByBooking(@RequestParam String bookingId) {
        return paymentService.getPaymentByBookingId(bookingId);
    }

    @PostMapping("create")
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentService.addPayment(payment);
    }

    @PostMapping("update")
    public Payment updatePayment(@RequestParam String paymentId) {
        return paymentService.setStatusPayment(paymentId);
    }

    //delete
    @DeleteMapping("delete")
    public void deletePayment(@RequestParam String paymentId) {
        paymentService.deletePayment(paymentId);
    }
}
