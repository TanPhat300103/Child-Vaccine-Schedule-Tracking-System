package org.gr1fpt.childvaccinescheduletrackingsystem.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    // Định dạng ngày giờ: dd/MM/yyyy HH:mm:ss
    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    // Hardcode thông tin hỗ trợ và chữ ký doanh nghiệp
    private final String supportPhone = "0563785425";
    private final String companyName = "FPT SWP GROUP 1";
    private final String companyAddress = "123 Đường ABC, Quận 1, TP.HCM";
    private final String companyEmail = "khangqhse184031@fpt.edu.vn";
    private final String companyPhone = "0987654321";
    private final String signature = "TÔI YÊU SPRING BOOT";

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Phương thức gửi email cơ bản
    public void sendEmail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom("your-email@gmail.com"); // Email gửi đi
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true); // true: gửi email dạng HTML

        mailSender.send(message);
    }


    public void sendBookingConfirmationEmail(String to, String child, String bookingDate,String customerName) throws MessagingException {

        String currentTime = LocalDateTime.now().format(dateTimeFormatter);

        String subject = "Xác nhận đặt lịch thành công - Dịch vụ của " + companyName;


        String body = "<html>" +
                "<body style='font-family: Arial, sans-serif; color: #333333; margin:0; padding:0;'>" +
                "  <table align='center' style='width:600px; border:1px solid #dddddd; padding:20px;'>" +
                "    <tr>" +
                "      <td style='text-align: center;'>" +
                "         <h2 style='color: #4CAF50;'>Xác Nhận Đặt Lịch Thành Công</h2>" +
                "      </td>" +
                "    </tr>" +
                "    <tr>" +
                "      <td>" +
                "          <p>Chào " + customerName + ",</p>" +
                "         <p>Chúng tôi xin trân trọng thông báo rằng Quý khách đã đặt lịch thành công cho dịch vụ của <strong>" + companyName + "</strong>." +
                "         <br><strong>Ngày đặt lịch:</strong> " + currentTime + "</p>" +
                "         <p><strong>Thông tin trẻ:</strong> " + child + "</p>" +
                "         <p><strong>Ngày hẹn:</strong> " + bookingDate + "</p>" +
                "         <p>Nếu Quý khách không thực hiện yêu cầu đặt lịch này, xin vui lòng liên hệ ngay với Tổng đài hỗ trợ qua số điện thoại <strong>" + supportPhone + "</strong> để được tư vấn và hỗ trợ kịp thời.</p>" +
                "         <p>Chúng tôi rất vinh hạnh được phục vụ Quý khách và mong rằng Quý khách sẽ có trải nghiệm tuyệt vời với dịch vụ của chúng tôi.</p>" +
                "         <p>Trân trọng,</p>" +
                "         <p><strong>" + signature + "</strong></p>" +
                "         <p style='font-size: 0.9em; color: #777777;'>" +
                "            Địa chỉ: " + companyAddress + "<br>" +
                "            Email: " + companyEmail + " | Điện thoại: " + companyPhone +
                "         </p>" +
                "      </td>" +
                "    </tr>" +
                "  </table>" +
                "</body>" +
                "</html>";

        sendEmail(to, subject, body);
    }

}
