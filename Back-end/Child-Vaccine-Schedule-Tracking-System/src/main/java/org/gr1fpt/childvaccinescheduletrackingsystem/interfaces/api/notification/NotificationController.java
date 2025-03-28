package org.gr1fpt.childvaccinescheduletrackingsystem.interfaces.api.notification;

import org.gr1fpt.childvaccinescheduletrackingsystem.application.notification.NotificationService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.notification.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("notification")
@CrossOrigin(origins = "*")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<Notification> getNotifications() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("findbycustomer")
    public List<Notification> getNotificationsByCustomer(@RequestParam String customerId) {
        return notificationService.getNotificationsByCustomer(customerId);
    }

        @GetMapping("findbyrole")
    public List<Notification> getNotificationsByRole(@RequestParam int roleId) {
        return notificationService.getNotificationsByRole(roleId);
    }

    @PostMapping("create")
    public Notification createNotification(@RequestBody Notification notification) {
        return notificationService.saveNotification(notification);
    }

    @PostMapping("update")
    public Notification updateNotification(@RequestBody Notification notification) {
        return notificationService.updateNoti(notification);
    }

    @DeleteMapping("delete")
    public void deleteNotification(@RequestParam int id) {
         notificationService.deleteNotification(id);
    }

    @GetMapping("findid")
    public Notification getNotificationById(@RequestParam int id) {
        return notificationService.getNotificationById(id);
    }
}
