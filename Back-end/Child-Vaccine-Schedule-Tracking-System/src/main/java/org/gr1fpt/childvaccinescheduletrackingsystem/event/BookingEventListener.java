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
import org.gr1fpt.childvaccinescheduletrackingsystem.notification.Notification;
import org.gr1fpt.childvaccinescheduletrackingsystem.notification.NotificationRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.notification.NotificationService;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccinedetail.VaccineDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccinedetail.VaccineDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
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
    @Autowired
    private VaccineDetailRepository vaccineDetailRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private NotificationRepository notificationRepository;

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
        //Tự gửi maik khi book lịch xong
        emailService.sendBookingConfirmationEmail(to,child.getLastName()+" "+child.getFirstName(),date,customer.getLastName()+" "+customer.getFirstName());

    }

    //Tạo thông báo cho customer khi book lịch xong
    @EventListener
    public void createNotiAfterBooking(BookingDTO bookingDTO){
        //khúc này lấy thêm dữ liệu thôi
        String lastName = childRepository.findById(bookingDTO.getChild().getChildId()).orElseThrow().getLastName();
        String firstName = childRepository.findById(bookingDTO.getChild().getChildId()).orElseThrow().getFirstName();
        String childName = lastName+" "+firstName;


        Notification noti = new Notification();
        noti.setCustomer(bookingDTO.getBooking().getCustomer());
        noti.setDate(Date.valueOf(LocalDate.now()));
        noti.setTittle("Đăng ký tiêm chủng của bạn đã được xác nhận!");
        noti.setMessage("Cảm ơn bạn đã đăng ký tiêm chủng với chúng tôi!\n"+
                "Lịch hẹn của bé "+childName+" đã được ghi nhận thành công.\n"+
                "Vui lòng chú ý và đến đúng thời gian đã đặt và mang theo giấy tờ cần thiết.\n"+
                "Chúc bạn sức khỏe dồi dào!\n");
        notificationRepository.save(noti);
    }

    @EventListener
    public void updateScheduleNextDose(BookingDetail bookingDetail) {
        List<BookingDetail> list = bookingDetailService.findByBooking(bookingDetail.getBooking().getBookingId());

        String vaccine = bookingDetail.getVaccine().getVaccineId();
        Date date_temp = bookingDetail.getAdministeredDate();;
        for(BookingDetail bd : list){
            if(bd.getVaccine().getVaccineId().equals(vaccine) && !bd.getBookingDetailId().equals(bookingDetail.getBookingDetailId()) && bd.getStatus()==1){
                List<VaccineDetail> vaccineDetail = vaccineDetailRepository.findByVaccine_VaccineId(bd.getVaccine().getVaccineId());
                int day = vaccineDetail.get(0).getDay();
                LocalDate newScheduleDate = date_temp.toLocalDate().plusDays(day);
                bd.setScheduledDate(Date.valueOf(newScheduleDate));
                date_temp = bd.getScheduledDate();
                bookingDetailRepository.save(bd);
            }
        }

    }

    @EventListener
    public void handleBookingConfirmed(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        booking.setStatus(2);
        bookingRepository.save(booking);
    }
}
