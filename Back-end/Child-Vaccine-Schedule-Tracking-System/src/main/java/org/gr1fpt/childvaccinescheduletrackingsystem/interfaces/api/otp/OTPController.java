package org.gr1fpt.childvaccinescheduletrackingsystem.interfaces.api.otp;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.otp.OTPService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.customer.Customer;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.customer.CustomerRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.otp.OTP;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.email.EmailService;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.otp.OTPRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("otp")
@RequiredArgsConstructor
public class OTPController {

    private final EmailService emailService;
    private final OTPService otpService;
    private final CustomerRepository customerRepository;
    private final OTPRepository OTPrepository;

    @PostMapping("/send")
    public String sendOtp(@RequestParam String email) {
        Optional<Customer> customer = customerRepository.findByEmail(email);
        if (customer.isEmpty()) {
            return "Invalid email";
        }

        String otp = otpService.generateOTP(customer.get().getEmail());
        try {
            emailService.sendOtpEmail(email, otp);
            return "OTP sent successfully";
        } catch (MessagingException e) {
            return "Failed to send OTP";
        }
    }

    @GetMapping("/verify")
    public String verifyOtp(@RequestParam String email, @RequestParam String otp) {
        Optional<Customer> customer = customerRepository.findByEmail(email);
        if (customer.isEmpty()) {
            return "Invalid email";
        }

        boolean isValid = otpService.verifyOTP(customer.get().getEmail(), otp);
        return isValid ? "OTP verified successfully" : "Invalid or expired OTP";
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String email, @RequestParam String otp, @RequestParam String newPassword) {
        Optional<Customer> customer = customerRepository.findByEmail(email);
        if (customer.isEmpty()) {
            return "Invalid email";
        }

        Optional<OTP> otpreal = OTPrepository.findTopByEmailOrderByExpiryDateDesc(email);
        if (!otpreal.get().getOtp().equals(otp)) {
            return "Invalid OTP";
        }
        customer.get().setPassword(newPassword);
        customerRepository.save(customer.get());
        return "Password reset successfully";
    }


}
