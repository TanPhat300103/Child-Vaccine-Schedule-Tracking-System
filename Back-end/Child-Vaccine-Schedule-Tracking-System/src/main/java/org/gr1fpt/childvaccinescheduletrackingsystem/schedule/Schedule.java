package org.gr1fpt.childvaccinescheduletrackingsystem.schedule;

import jakarta.mail.MessagingException;
import org.gr1fpt.childvaccinescheduletrackingsystem.booking.BookingRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.bookingdetail.BookingDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.bookingdetail.BookingDetailRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.email.EmailService;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccinedetail.VaccineDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccinedetail.VaccineDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class Schedule {

    SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");

    @Autowired
    VaccineDetailRepository vaccineDetailRepo;

    @Autowired
    EmailService emailService;

    @Autowired
    BookingDetailRepository bookingDetailRepo;
    //check quantity neu ve 0 thi set status = 0
    @Scheduled(fixedRate = 60000)
    public void checkQuantity() {
        for(VaccineDetail detail : vaccineDetailRepo.findAll()) {
            if(detail.getQuantity()==0){
                detail.setStatus(false);
                vaccineDetailRepo.save(detail);
            }
        }
    }

    @Scheduled(cron = "0 00 7 * * ?")
    //0: giây thứ 0
    //00: phút
    //8: giờ
    // * *: gửi hằng ngày không kể thứ, tuần
    public void sendReminder() throws MessagingException {
        for(BookingDetail detail : bookingDetailRepo.findAll()){
            if(detail.getScheduledDate().equals(Date.valueOf(LocalDate.now()))){
                String vaccineName= detail.getVaccine().getName();
                if(detail.getVaccineCombo()!=null){
                    vaccineName = detail.getVaccineCombo().getName();
                }
                emailService.sendReminderEmail(detail.getBooking().getCustomer().getEmail(),detail.getChild().getLastName()+" "+detail.getChild().getFirstName(),detail.getBooking().getCustomer().getLastName()+" "+detail.getBooking().getCustomer().getFirstName(), detail.getScheduledDate(),vaccineName);
            }
        }
    }



}
