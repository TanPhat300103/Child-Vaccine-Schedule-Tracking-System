package org.gr1fpt.childvaccinescheduletrackingsystem.event;

import jakarta.mail.MessagingException;
import org.gr1fpt.childvaccinescheduletrackingsystem.booking.Booking;
import org.gr1fpt.childvaccinescheduletrackingsystem.booking.BookingDTO;
import org.gr1fpt.childvaccinescheduletrackingsystem.booking.BookingRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.bookingdetail.BookingDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.bookingdetail.BookingDetailRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.bookingdetail.BookingDetailService;
import org.gr1fpt.childvaccinescheduletrackingsystem.child.Child;
import org.gr1fpt.childvaccinescheduletrackingsystem.child.ChildRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.CustomerRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class BookingEventListener {
    @Autowired
    EmailService emailService;
    @Autowired
    CustomerRepository customerRepository;
    @Autowired
    ChildRepository childRepository;
    @Autowired
    BookingDetailService bookingDetailService;
    @Autowired
    BookingDetailRepository bookingDetailRepository;

    @EventListener
    public void handleBookingCreated(BookingDTO bookingDTO) throws MessagingException {
        Booking booking = bookingDTO.getBooking();
        Child child = childRepository.findById(bookingDTO.getChild().getChildId()).orElseThrow();
        Customer customer = customerRepository.findById(booking.getCustomer().getCustomerId()).orElseThrow();
        String to = customer.getEmail();

        // Khúc này là convert date thoi ko co gi het
        java.sql.Date sqlDate = booking.getBookingDate();
        LocalDate localDate = sqlDate.toLocalDate();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String date = localDate.format(formatter);
        emailService.sendBookingConfirmationEmail(to,child.getLastName()+" "+child.getFirstName(),date,customer.getLastName()+" "+customer.getFirstName());

    }

    @EventListener
    public void updateScheduleNextDose(BookingDetail bookingDetail) {
        List<BookingDetail> list = bookingDetailService.findByBooking(bookingDetail.getBooking().getBookingId());

        String vaccine = bookingDetail.getVaccine().getVaccineId();
        Date administeredDate = bookingDetail.getAdministeredDate();
        Date date_temp = bookingDetail.getAdministeredDate();;
        for(BookingDetail bd : list){
            if(bd.getVaccine().getVaccineId().equals(vaccine) && !bd.getBookingDetailId().equals(bookingDetail.getBookingDetailId()) && bd.getStatus()==1){

                int day = bd.getBooking().getBookingDate().getDay();
                LocalDate newScheduleDate = date_temp.toLocalDate().plusDays(day);
                bd.setScheduledDate(Date.valueOf(newScheduleDate));
                date_temp = bd.getScheduledDate();
                bookingDetailRepository.save(bd);
            }
        }

    }
}
