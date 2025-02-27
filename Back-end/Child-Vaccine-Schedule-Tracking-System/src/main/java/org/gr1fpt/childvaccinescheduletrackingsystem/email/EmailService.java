package org.gr1fpt.childvaccinescheduletrackingsystem.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccine.Vaccine;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.sql.Date;
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

    public void sendReminderEmail(String to, String child, String customerName, Date date, String vaccineName) throws MessagingException{
        String subject = "Nhắc nhở lịch tiêm chủng hôm nay";
        String body = "<div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>"
                + "<div style='max-width: 600px; background: #ffffff; margin: 0 auto; padding: 20px; border-radius: 8px; "
                + "box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);'>"
                + "<div style='background: #3498db; color: #ffffff; text-align: center; padding: 15px; font-size: 22px; font-weight: bold; "
                + "border-top-left-radius: 8px; border-top-right-radius: 8px;'>🏥 Nhắc nhở lịch tiêm chủng của Bé: <span style='text-transform: uppercase;'>" + child + "</span></div>"
                + "<div style='padding: 20px; color: #333; line-height: 1.6;'>"
                + "<p>Chào <b>" + customerName + "</b>,</p>"
                + "<p>Hôm nay là ngày <span style='color: #e74c3c; font-weight: bold;'>" + date + "</span>, bé <b>" + child + "</b> có lịch tiêm vaccine <b style='color: #3498db;'>" + vaccineName + "</b>.</p>"
                + "<p>Vui lòng đến địa điểm đã đăng ký đúng giờ để tránh chờ đợi.</p>"
                + "<p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua số hotline: <b style='color: #e74c3c;'>" + supportPhone + "</b>.</p>"
                + "</div>"
                + "<div style='text-align: center; background: #ecf0f1; padding: 15px; border-radius: 8px;'>"
                + "<p style='margin: 5px 0;'><b>" + companyName + "</b></p>"
                + "<p style='margin: 5px 0;'>" + companyAddress + "</p>"
                + "<p style='margin: 5px 0;'>📧 Email: <a href='mailto:" + companyEmail + "' style='color: #3498db; text-decoration: none;'>" + companyEmail + "</a></p>"
                + "<p style='margin: 5px 0;'>📞 Điện thoại: <b>" + companyPhone + "</b></p>"
                + "</div>"
                + "<div style='text-align: center; font-size: 14px; color: #666; padding-top: 15px;'>"
                + "</div>"
                + "</div>"
                + "</div>";


        sendEmail(to,subject,body);
    }

    public void sendReminderLaterEmail(String to, String child, String customerName, String vaccineName) throws MessagingException{
        String subject = "Nhắc nhở lịch tiêm chủng đã qua";
        String body = "<div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>"
                + "<div style='max-width: 600px; background: #ffffff; margin: 0 auto; padding: 20px; border-radius: 8px; "
                + "box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);'>"
                + "<div style='background: #3498db; color: #ffffff; text-align: center; padding: 15px; font-size: 22px; font-weight: bold; "
                + "border-top-left-radius: 8px; border-top-right-radius: 8px;'>🏥 Nhắc nhở lịch tiêm chủng của Bé: <span style='text-transform: uppercase;'>" + child + "</span></div>"
                + "<div style='padding: 20px; color: #333; line-height: 1.6;'>"
                + "<p>Chào <b>" + customerName + "</b>,</p>"
                + "<p>Đã qua lịch hẹn tiêm :<span style='color: #e74c3c; font-weight: bold;'></span>, bé <b>" + child + "</b> có lịch tiêm vaccine <b style='color: #3498db;'>" + vaccineName + "</b>.</p>"
                + "<p>Phụ huynh vui lòng đến địa điểm đã đăng ký để tiêm cho bé tránh quá hạn.</p>"
                +"<p>Nếu quá hạn nhiều ngày thì sẽ bị hủy lịch hẹn !!!</p>"
                + "<p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua số hotline: <b style='color: #e74c3c;'>" + supportPhone + "</b>.</p>"
                + "</div>"
                + "<div style='text-align: center; background: #ecf0f1; padding: 15px; border-radius: 8px;'>"
                + "<p style='margin: 5px 0;'><b>" + companyName + "</b></p>"
                + "<p style='margin: 5px 0;'>" + companyAddress + "</p>"
                + "<p style='margin: 5px 0;'>📧 Email: <a href='mailto:" + companyEmail + "' style='color: #3498db; text-decoration: none;'>" + companyEmail + "</a></p>"
                + "<p style='margin: 5px 0;'>📞 Điện thoại: <b>" + companyPhone + "</b></p>"
                + "</div>"
                + "<div style='text-align: center; font-size: 14px; color: #666; padding-top: 15px;'>"
                + "</div>"
                + "</div>"
                + "</div>";


        sendEmail(to,subject,body);
    }

    public void sendCancelEmail(String to, String child, String customerName, Date date, String vaccineName) throws MessagingException{
        String subject = "Nhắc nhở lịch tiêm chủng đã qua";
        String body = "<div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>"
                + "<div style='max-width: 600px; background: #ffffff; margin: 0 auto; padding: 20px; border-radius: 8px; "
                + "box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);'>"
                + "<div style='background: #e74c3c; color: #ffffff; text-align: center; padding: 15px; font-size: 22px; font-weight: bold; "
                + "border-top-left-radius: 8px; border-top-right-radius: 8px;'>⚠️ LỊCH TIÊM CHỦNG ĐÃ BỊ HỦY</div>"
                + "<div style='padding: 20px; color: #333; line-height: 1.6;'>"
                + "<p>Chào <b>" + customerName + "</b>,</p>"
                + "<p>Chúng tôi xin thông báo rằng lịch tiêm chủng của bé <b>" + child + "</b> vào ngày "
                + "<span style='color: #e74c3c; font-weight: bold;'>" + date + "</span> với vaccine "
                + "<b style='color: #3498db;'>" + vaccineName + "</b> đã bị <b style='color: #e74c3c;'>HỦY</b> do trễ hẹn vượt quá khoảng thời gian cho phép.</p>"
                + "<p>Để đảm bảo sức khỏe cho bé, quý khách vui lòng liên hệ với chúng tôi để đặt lại lịch tiêm mới trong thời gian sớm nhất.</p>"
                + "<p>📌 <b>Lưu ý:</b> Việc tiêm chủng đúng hạn rất quan trọng để đảm bảo hiệu quả của vaccine.</p>"
                + "<p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua số hotline: <b style='color: #e74c3c;'>" + supportPhone + "</b>.</p>"
                + "<p>Xin lỗi vì sự bất tiện này và rất mong nhận được phản hồi sớm từ bạn!</p>"
                + "</div>"
                + "<div style='text-align: center; background: #ecf0f1; padding: 15px; border-radius: 8px;'>"
                + "<p style='margin: 5px 0;'><b>" + companyName + "</b></p>"
                + "<p style='margin: 5px 0;'>" + companyAddress + "</p>"
                + "<p style='margin: 5px 0;'>📧 Email: <a href='mailto:" + companyEmail + "' style='color: #3498db; text-decoration: none;'>" + companyEmail + "</a></p>"
                + "<p style='margin: 5px 0;'>📞 Điện thoại: <b>" + companyPhone + "</b></p>"
                + "</div>"
                + "<div style='text-align: center; font-size: 14px; color: #666; padding-top: 15px;'>"
                + "<p><i>" + signature + "</i></p>"
                + "</div>"
                + "</div>"
                + "</div>";



        sendEmail(to,subject,body);
    }

}
