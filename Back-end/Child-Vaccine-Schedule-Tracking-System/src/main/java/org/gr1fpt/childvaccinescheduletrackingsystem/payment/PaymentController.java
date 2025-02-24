package org.gr1fpt.childvaccinescheduletrackingsystem.payment;

import org.gr1fpt.childvaccinescheduletrackingsystem.payment.vnpay.VNPAYService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("payment")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;
    @Autowired
    VNPAYService vnpayService;

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
    public ResponseEntity<Map<String, Object>> updatePayment(@RequestParam String paymentId, @RequestParam String coupon, @RequestParam boolean method) throws UnsupportedEncodingException {
        Payment payment = paymentService.updatePayment(paymentId, coupon, method);
        Map<String, Object> response = new HashMap<>();
        if (method) { // Nếu chọn thanh toán qua VNPay
            String vnpayUrl = vnpayService.createVnpayUrl(payment.getPaymentId(), payment.getTotal());
            response.put("VNPAYURL", vnpayUrl);
        } else {
            response.put("message", "COD");
        }
        response.put("paymentId", payment.getPaymentId());
        return ResponseEntity.ok(response);
    }


    //delete
    @DeleteMapping("delete")
    public void deletePayment(@RequestParam String paymentId) {
        paymentService.deletePayment(paymentId);
    }
}
