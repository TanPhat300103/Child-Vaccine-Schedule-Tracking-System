package org.gr1fpt.childvaccinescheduletrackingsystem.service;

import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Booking;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.MarketingCampaign;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Payment;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.BookingRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.MarketingCampaignRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.PaymentRepository;
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

    public Payment addPayment(Payment payment) {
        if(paymentRepository.existsById(generateId(payment.getBooking().getBookingId()))){
            throw new CustomException("Payment already exists",HttpStatus.CONFLICT);
        }
        else {
            Booking booking = getBookingById(payment.getBooking().getBookingId());
            MarketingCampaign marketing = getCampaignById(payment.getMarketingCampaign().getMarketingCampaignId());

            int discount = 0;
            if (marketing != null) {
                discount = marketing.getDiscount();
            }

            payment.setPaymentId(generateId(payment.getBooking().getBookingId()));
            payment.setDate(Date.valueOf(LocalDate.now()));

            int total = booking.getTotalAmount();
            int totalAfterDiscount = calculateTotal(discount, total);
            payment.setTotal(totalAfterDiscount);
            payment.setStatus(false);

            if (!marketingCampaignRepository.existsById(payment.getMarketingCampaign().getMarketingCampaignId())) {
                throw new CustomException("Marketing campaign " + payment.getMarketingCampaign().getMarketingCampaignId() + " not found", HttpStatus.NOT_FOUND);
            } else if (!marketing.isActive()) {
                throw new CustomException("Marketing is not active", HttpStatus.NOT_FOUND);
            } else if (payment.getDate().after(marketing.getEndTime())) {
                throw new CustomException("Marketing campaign is ended", HttpStatus.BAD_REQUEST);
            } else if (payment.getDate().before(marketing.getStartTime())) {
                throw new CustomException("Marketing campaign is not started", HttpStatus.BAD_REQUEST);
            }
        }
        return paymentRepository.save(payment);
    }

    public Payment setStatusPayment(String paymentId) {
        if(!paymentRepository.existsById(paymentId)){
            throw new CustomException("Payment not found",HttpStatus.NOT_FOUND);
        }
        Payment payment = getPaymentById(paymentId);
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
