package org.gr1fpt.childvaccinescheduletrackingsystem.notification;

import org.gr1fpt.childvaccinescheduletrackingsystem.exception.CustomException;
import org.gr1fpt.childvaccinescheduletrackingsystem.role.RoleService;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccine.Vaccine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private RoleService roleService;

    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Notification createNotificationCustomer(Notification notification) {
        notification.setTittle("Childvaccine Schedule Tracking System");
        notification.setRole(roleService.getRoleById(1));
        notification.setDate(Date.valueOf(LocalDate.now()));
        return notificationRepository.save(notification);
    }

    public Notification createNotificationAfterPayment(Notification notification) {
        notification.setTittle("Đã thanh toán");
        notification.setDate(Date.valueOf(LocalDate.now()));
        return notificationRepository.save(notification);
    }


    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public List<Notification> getNotificationsByCustomer(String customerId){
        return notificationRepository.findByCustomer_CustomerId(customerId);
    }

    public List<Notification> getNotificationsByRole(int roleId){
        return notificationRepository.findByRole_RoleId(roleId);
    }

    public Notification updateNoti(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void deleteNotification(int id) {
        if(notificationRepository.existsById(String.valueOf(id))) {
            notificationRepository.deleteById(String.valueOf(id));
        }
        else throw new CustomException("ID Notification not found", HttpStatus.BAD_REQUEST);
    }

    public Notification getNotificationById(int id) {
        return notificationRepository.findById(String.valueOf(id)).orElseThrow(() -> new CustomException("Notification ID" + id + " not found", HttpStatus.BAD_REQUEST));
    }
}
