package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.eventlistener;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.bookingdetail.BookingDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.child.ChildRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.notification.Notification;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.notification.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDate;

@Component
public class BookingDetailEventListener {

    @Autowired
    ChildRepository childRepository;

    @Autowired
    NotificationRepository notificationRepository;

    //tự tạo thông báo sau khi hoàn thành xong 1 mũi tiêm
    @EventListener
    public Notification createNotiAfterConfirmDetail(BookingDetail bookingDetail) {
        //khúc này lấy thêm dữ liệu thôi
        String lastName = childRepository.findById(bookingDetail.getChild().getChildId()).orElseThrow().getLastName();
        String firstName = childRepository.findById(bookingDetail.getChild().getChildId()).orElseThrow().getFirstName();
        String childName = lastName+" "+firstName;
        String vaccineName = bookingDetail.getVaccine().getName();
        //tạo thông báo
        Notification notification = new Notification();
        notification.setCustomer(bookingDetail.getBooking().getCustomer());
        notification.setDate(Date.valueOf(LocalDate.now()));
        notification.setTittle("Bé " + childName + " đã hoàn thành một mũi tiêm!");
        notification.setMessage("Chúc mừng bạn! Bé " + childName + " vừa hoàn thành mũi tiêm " +vaccineName+".\n" +
                "Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi.\n" +
                "Vui lòng theo dõi sức khỏe của bé và liên hệ nếu cần hỗ trợ.\n" +
                "Chúc bé luôn khỏe mạnh và phát triển tốt!");

        return notificationRepository.save(notification);
    }
}
