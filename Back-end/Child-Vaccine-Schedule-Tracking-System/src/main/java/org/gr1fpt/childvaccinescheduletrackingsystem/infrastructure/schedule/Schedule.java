package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.schedule;

import jakarta.mail.MessagingException;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.bookingdetail.BookingDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.bookingdetail.BookingDetailRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.email.EmailService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.vaccinedetail.VaccineDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.vaccinedetail.VaccineDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.List;

@Service
public class Schedule {

    SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");

    @Autowired
    VaccineDetailRepository vaccineDetailRepo;

    @Autowired
    EmailService emailService;

    @Autowired
    BookingDetailRepository bookingDetailRepo;

    @Autowired
    private ApplicationEventPublisher eventPublisher;


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

    @Scheduled(cron ="0 00 7 * * ?")
    public void sendLaterReminder() throws MessagingException {
        for(BookingDetail detail : bookingDetailRepo.findAll()){
            String vaccineName= detail.getVaccine().getName();
            if(detail.getVaccineCombo()!=null){
                vaccineName = detail.getVaccineCombo().getName();
            }

            String vaccineId = detail.getVaccine().getVaccineId();
            List<VaccineDetail> list = vaccineDetailRepo.findByVaccine_VaccineIdAndQuantityGreaterThanAndStatusTrueOrderByExpiredDateAsc(vaccineId,0);
            VaccineDetail vaccineDetail = list.getFirst();

            LocalDate scheduledDate = detail.getScheduledDate().toLocalDate();
            LocalDate toleranceDate = scheduledDate.plusDays(vaccineDetail.getTolerance());

            //HỦY LỊCH NẾU VƯỢT QUÁ TOLERANCE
            // So sánh nếu hôm nay đã vượt quá hạn chót
            if (LocalDate.now().isAfter(toleranceDate) && detail.getStatus()==1) {
                detail.setStatus(3);
                bookingDetailRepo.save(detail);
                //bắt event nếu tất cả bookingdetail bị hủy thì tự hủy booking luôn
                eventPublisher.publishEvent(detail.getBooking().getBookingId());

                //Gửi email là bị hủy lịch khi vượt quá tolerance
                emailService.sendCancelEmail(detail.getBooking().getCustomer().getEmail(),detail.getChild().getLastName()+" "+detail.getChild().getFirstName(),detail.getBooking().getCustomer().getLastName()+" "+detail.getBooking().getCustomer().getFirstName(), detail.getScheduledDate(),vaccineName);
            }

            //SEND MAIL KHI BỊ TRỄ LỊCH
            else if(detail.getScheduledDate().before(Date.valueOf(LocalDate.now())) &&  detail.getStatus()==1){
                emailService.sendReminderLaterEmail(detail.getBooking().getCustomer().getEmail(),detail.getChild().getLastName()+" "+detail.getChild().getFirstName(),detail.getBooking().getCustomer().getLastName()+" "+detail.getBooking().getCustomer().getFirstName(),vaccineName);
            }
        }
    }


}
