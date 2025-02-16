package org.gr1fpt.childvaccinescheduletrackingsystem.service;

import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Booking;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.BookingDTO;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.MarketingCampaign;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Payment;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.BookingRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.CustomerRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.MarketingCampaignRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BookingDetailService bookingDetailService;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private MarketingCampaignRepository marketingCampaignRepository;
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public String generateId(String customerId) {
        long count = bookingRepository.countByCustomer_CustomerId(customerId) + 1;
        return customerId + "-B" + count;
    }

    public String generatePaymentId(String bookingId) {
        return "P-" + bookingId;
    }

    public MarketingCampaign getCampaignById(String campaignId) {
        return marketingCampaignRepository.findById(campaignId).orElseThrow(() -> new CustomException("CAMPAIGN NOT FOUND", HttpStatus.NOT_FOUND));
    }

    public int calculateTotal(int discount,int total) {
        double discountAmount = (discount / 100.0) * total;
        return (int) (total - discountAmount); // Trả về kết quả là số nguyên
    }


    private void createPayment( Booking savedBooking) {
        if (paymentRepository.existsById(generatePaymentId(savedBooking.getBookingId()))) {
            throw new CustomException("Payment already exists", HttpStatus.CONFLICT);
        }



            Payment payment = new Payment();
            payment.setPaymentId(generatePaymentId(savedBooking.getBookingId()));
            payment.setDate(Date.valueOf(LocalDate.now()));

            payment.setStatus(false);
            payment.setBooking(savedBooking);

            // Lưu payment vào cơ sở dữ liệu
            paymentRepository.save(payment);

    }

    public Booking saveBooking(BookingDTO bookingDTO) {
        Booking booking = bookingDTO.getBooking();
        if(customerRepository.findById(booking.getCustomer().getCustomerId()).isPresent()) {
            booking.setBookingId(generateId(booking.getCustomer().getCustomerId()));
            bookingDTO.getBooking().setBookingId(booking.getBookingId());
            Booking savedBooking = bookingRepository.save(booking);

            //PAYMENT
            createPayment( savedBooking);


            bookingDetailService.create(bookingDTO);
            return savedBooking;
        }
        else throw new CustomException("Customer Id " + booking.getCustomer().getCustomerId()+" does not exist", HttpStatus.BAD_REQUEST);
    }

    public List<Booking> getBookingsByCustomerId(String customerId) {
        if(customerRepository.existsById(customerId)) {
            return bookingRepository.findByCustomer_CustomerId(customerId);
        }
        else throw new CustomException("Customer Id " + customerId + " does not exist", HttpStatus.BAD_REQUEST);
    }

    public List<Booking> getBookingByStatus(int status) {
        return bookingRepository.findByStatus(status);
    }

    public Booking getBookingById(String bookingId) {
        return bookingRepository.findById(bookingId).orElseThrow(() -> new CustomException("Booking Id " + bookingId + " does not exist", HttpStatus.BAD_REQUEST));
    }

    public Booking updateBooking(Booking booking) {
        if(bookingRepository.existsById(booking.getBookingId())) {
            return bookingRepository.save(booking);
        }
        else throw new CustomException("Booking Id " + booking.getBookingId() + " does not exist", HttpStatus.BAD_REQUEST);
    }

    public void setStatus(int status, String bookingId) {
        Booking booking = getBookingById(bookingId);
        booking.setStatus(status);
        bookingRepository.save(booking);
    }

    @Transactional
    public void delete (String id)
    {
        bookingDetailService.deleteByBookingId(id);
        bookingRepository.deleteById(id);
    }



}
