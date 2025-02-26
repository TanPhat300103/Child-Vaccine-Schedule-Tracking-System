package org.gr1fpt.childvaccinescheduletrackingsystem.email;

import jakarta.mail.MessagingException;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.time.LocalDate;

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
            emailService.sendBookingConfirmationEmail(to, "1", "2", "name");
            return "Email sent successfully to " + to;
        } catch (MessagingException e) {
            return "Error sending email: " + e.getMessage();
        }
    }

    @GetMapping("/reminder")
    public String reminderTestEmail() {
        try {
            emailService.sendReminderEmail("nha3697@gmail.com","1","Thu Hà", Date.valueOf(LocalDate.now()));
            return "Email sent successfully to " ;
        } catch (MessagingException e) {
            return "Error sending email: " + e.getMessage();
        }
    }

}
