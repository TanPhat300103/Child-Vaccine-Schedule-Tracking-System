package org.gr1fpt.childvaccinescheduletrackingsystem.otp;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.gr1fpt.childvaccinescheduletrackingsystem.customer.Customer;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OTP {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email; // Lưu email thay vì customerId
    @Column(nullable = false, length = 6)
    private String otp;
    @Column(nullable = false)
    private LocalDateTime expiryDate;
    @Column(nullable = false)
    private boolean isUsed = false;


}
