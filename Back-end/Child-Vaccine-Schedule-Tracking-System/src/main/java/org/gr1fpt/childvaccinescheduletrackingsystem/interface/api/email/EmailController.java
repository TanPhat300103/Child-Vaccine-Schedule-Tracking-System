package org.gr1fpt.childvaccinescheduletrackingsystem.email;

import jakarta.mail.MessagingException;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.email.EmailService;
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


    //TEST
    @GetMapping("/reminder")
    public String reminderTestEmail() {
        try {
            emailService.sendReminderEmail("nha3697@gmail.com","1","Thu Hà", Date.valueOf(LocalDate.now()),"");
            return "Email sent successfully to " ;
        } catch (MessagingException e) {
            return "Error sending email: " + e.getMessage();
        }
    }

    //TEST
    @GetMapping("/payment")
    public String paymentTest() {
        try {
            emailService.senPaymentEmail("nha3697@gmail.com","Nguyễn Phạm Thu Hà",Date.valueOf(LocalDate.now()),1500000,"123456789",true,"KH012","Quận 9");
            return "Email sent successfully to " ;
        } catch (MessagingException e) {
            return "Error sending email: " + e.getMessage();
        }
    }
    //TEST
    @GetMapping("otp")
    public String otp(){
        try {
            emailService.sendOtpEmail("nha3697@gmail.com","123456");
            return "Email sent successfully to " ;
        } catch (MessagingException e) {
            return "Error sending email: " + e.getMessage();
        }
    }

}
