package org.gr1fpt.childvaccinescheduletrackingsystem.notification;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.role.Role;

import java.sql.Date;

@Entity
@Table(name = "Notification")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Notification {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "Tittle")
    private String tittle;

    @Column(name = "Message")
    private String message;

    @ManyToOne
    @JoinColumn(name = "roleId")
    private Role role;

    @ManyToOne
    @JoinColumn(name = "customerId")
    private Customer customer;

    @Column(name = "Date")
    private Date date;


    @Column(name = "isRead")
    boolean isRead = false;
}
