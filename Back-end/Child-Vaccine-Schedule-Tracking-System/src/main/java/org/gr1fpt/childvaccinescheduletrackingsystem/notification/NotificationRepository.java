package org.gr1fpt.childvaccinescheduletrackingsystem.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByCustomer_CustomerId(String customerId);
    List<Notification> findByRole_RoleId(int roleId);
}
