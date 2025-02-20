package org.gr1fpt.childvaccinescheduletrackingsystem.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
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
    

    @PostMapping("update")
    public Payment updatePayment(@RequestParam String paymentId,@RequestParam String coupon) {
        return paymentService.updatePayment(paymentId,coupon);
    }

    //delete
    @DeleteMapping("delete")
    public void deletePayment(@RequestParam String paymentId) {
        paymentService.deletePayment(paymentId);
    }
}
