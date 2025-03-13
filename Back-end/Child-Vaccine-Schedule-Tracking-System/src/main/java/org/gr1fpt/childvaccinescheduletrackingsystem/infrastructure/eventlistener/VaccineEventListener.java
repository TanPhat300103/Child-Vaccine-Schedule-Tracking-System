package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.eventlistener;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.notification.Notification;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.notification.NotificationService;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.role.RoleService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.vaccinedetail.VaccineDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.vaccinedetail.VaccineDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDate;

@Component
public class VaccineEventListener {
    @Autowired
    VaccineDetailService vaccineDetailService;

    @Autowired
    NotificationService notificationService;
    @Autowired
    RoleService roleService;

    @EventListener
    public void handleOutOfStockVaccine(VaccineDetail vaccineDetail) {
        Notification notification = new Notification();
        notification.setDate(Date.valueOf(LocalDate.now()));
        notification.setRole(roleService.getRoleById(2));
        notification.setTittle("Out of Stock Vaccine");
        notification.setMessage("Vaccine "+vaccineDetail.getVaccine().getName() + " has been out of stock: "+vaccineDetail.getQuantity());
        notificationService.saveNotification(notification);
    }
}
