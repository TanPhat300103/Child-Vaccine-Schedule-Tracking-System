package org.gr1fpt.childvaccinescheduletrackingsystem.payment;

import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.booking.Booking;
import org.gr1fpt.childvaccinescheduletrackingsystem.marketingcampaign.MarketingCampaign;
import org.gr1fpt.childvaccinescheduletrackingsystem.booking.BookingRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.marketingcampaign.MarketingCampaignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private MarketingCampaignRepository marketingCampaignRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(String paymentId) {
        return paymentRepository.findById(paymentId).orElseThrow(() -> new CustomException("Payment not found", HttpStatus.NOT_FOUND));
    }

    public Payment getPaymentByTransactionId(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId);
        if (payment == null) {
            throw new CustomException("Payment not found",HttpStatus.NOT_FOUND);
        }
        return payment;
    }

    public Payment getPaymentByBookingId(String bookingId) {
        Payment payment = paymentRepository.findByBooking_BookingId(bookingId);
        if (payment == null) {
            throw new CustomException("Payment not found",HttpStatus.NOT_FOUND);
        }
        return payment;
    }

    public String generateId(String bookingId) {
        return "P-" + bookingId;
    }

    public int calculateTotal(int discount,int total) {
        double discountAmount = (discount / 100.0) * total;
        return (int) (total - discountAmount); // Trả về kết quả là số nguyên
    }

    public Booking getBookingById(String bookingId) {
        return bookingRepository.findById(bookingId).orElseThrow(() -> new CustomException("Booking not found", HttpStatus.NOT_FOUND));
    }

    public MarketingCampaign getCampaignById(String campaignId) {
        return marketingCampaignRepository.findById(campaignId).orElse(null);
    }

    public MarketingCampaign getCampaignByCouponCode(String coupon) {
        return marketingCampaignRepository.findByCoupon(coupon);
    }



    public void createPayment(Booking savedBooking) {
        if (paymentRepository.existsById(generateId(savedBooking.getBookingId()))) {
            throw new CustomException("Payment already exists", HttpStatus.CONFLICT);
        }
        Payment payment = new Payment();
        payment.setPaymentId(generateId(savedBooking.getBookingId()));
        payment.setDate(Date.valueOf(LocalDate.now()));
        payment.setTotal(savedBooking.getTotalAmount());
        payment.setStatus(false);
        payment.setBooking(savedBooking);

        // Lưu payment vào cơ sở dữ liệu
         paymentRepository.save(payment);

    }

    public Payment updatePayment(String paymentId,String coupon) {
        if(!paymentRepository.existsById(paymentId)){
            throw new CustomException("Payment not found",HttpStatus.NOT_FOUND);
        }
        Payment payment = getPaymentById(paymentId);
        Booking booking = getBookingById(payment.getBooking().getBookingId());
        int discount = 0;
        if(coupon != null){
            MarketingCampaign marketing = getCampaignByCouponCode(coupon);
            if (marketing != null) {
                if (!marketing.isActive()){
                    throw new CustomException("Coupon is not active",HttpStatus.CONFLICT);
                }

                discount = marketing.getDiscount();
            }
        }
        int total = booking.getTotalAmount();
        int totalAfterDiscount = calculateTotal(discount, total);
        payment.setTotal(totalAfterDiscount);
        if(!payment.isStatus()){
        payment.setStatus(true);}
        else
            payment.setStatus(false);
        return paymentRepository.save(payment);
    }

    //update tu chua thanh toan -> da thanh toan

    //delete
    public void deletePayment(String paymentId) {
        paymentRepository.deleteById(paymentId);
    }

}
