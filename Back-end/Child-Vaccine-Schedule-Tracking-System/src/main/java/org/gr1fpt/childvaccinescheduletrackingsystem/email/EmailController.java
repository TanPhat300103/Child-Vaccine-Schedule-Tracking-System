package org.gr1fpt.childvaccinescheduletrackingsystem.email;

import jakarta.mail.MessagingException;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/email")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/send")
    public String sendTestEmail(@RequestParam String to) {
        try {
            emailService.sendBookingConfirmationEmail(to);
            return "Email sent successfully to " + to;
        } catch (MessagingException e) {
            return "Error sending email: " + e.getMessage();
        }
    }

}
