package org.gr1fpt.childvaccinescheduletrackingsystem.booking;

import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.CustomerRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.bookingdetail.BookingDetailService;
import org.gr1fpt.childvaccinescheduletrackingsystem.payment.PaymentService;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccine.Vaccine;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccine.VaccineRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccinecombo.VaccineCombo;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccinecombo.VaccineComboRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private PaymentService paymentService;
    @Autowired
    private VaccineRepository vaccineRepository;
    @Autowired
    private VaccineComboRepository vaccineComboRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public String generateId(String customerId) {
        long count = bookingRepository.countByCustomer_CustomerId(customerId) + 1;
        return customerId + "-B" + count;
    }

    public int calculatorAmount(BookingDTO bookingDTO)
    {
        int total = 0;
        Booking booking = bookingDTO.getBooking();
        List<String> listVaccineId = bookingDTO.getVaccineId();
        List<String> listVaccineComboId = bookingDTO.getVaccineComboId();

        //Add price của vaxin lẻ vào ToTal
        if(listVaccineId!=null) {
            for (String vaccineId : listVaccineId) {
                Vaccine vaccine = vaccineRepository.findById(vaccineId).orElseThrow(() -> new RuntimeException("Vaccine not found"));
                total += vaccine.getPrice();
            }
        }
        //Add price của combo vào Total
        if (listVaccineComboId != null) {
            for (String vaccineComboId : listVaccineComboId) {
                VaccineCombo combo = vaccineComboRepository.findById(vaccineComboId).orElseThrow(() -> new RuntimeException("Vaccine combo not found"));
                total+= combo.getPriceCombo();
            }
        }
        System.out.println("1"+total);
        return total;
    }

    @Transactional
    public Booking saveBooking(BookingDTO bookingDTO) {
        Booking booking = bookingDTO.getBooking();
        if(customerRepository.findById(booking.getCustomer().getCustomerId()).isPresent()) {
            booking.setBookingId(generateId(booking.getCustomer().getCustomerId()));
            bookingDTO.getBooking().setBookingId(booking.getBookingId());
            //Set booking total
            bookingDTO.getBooking().setTotalAmount(calculatorAmount(bookingDTO));
            System.out.println("2"+calculatorAmount(bookingDTO));

            Booking savedBooking = bookingRepository.save(booking);
            //PAYMENT
            paymentService.createPayment(savedBooking);
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
