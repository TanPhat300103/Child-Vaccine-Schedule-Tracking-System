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
    private final String companyEmail = "khangqhse184031@fpt.edu.vn | hanptse184261@fpt.edu.vn";
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

    public void sendReminderEmail(String to, String child, String customerName, Date date, String vaccineName) throws MessagingException {
        String subject = "Nhắc Nhở Lịch Tiêm Chủng Hôm Nay - Bé " + child;
        String body = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<style>"
                + "@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }"
                + "@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }"
                + "@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }"
                + "</style>"
                + "</head>"
                + "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f4f8;'>"
                + "<div style='max-width: 650px; margin: 20px auto; background: linear-gradient(135deg, #ffffff 0%, #f9fcff 100%); "
                + "border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden; animation: fadeIn 1s ease-in;'>"

                // Header với animation
                + "<div style='background: linear-gradient(to right, #2ecc71, #3498db); padding: 25px; text-align: center; color: white;'>"
                + "<h1 style='margin: 0; font-size: 26px; animation: slideUp 0.8s ease-out;'>"
                + "🏥 Nhắc Nhở Tiêm Chủng Bé <span style='text-transform: uppercase; font-weight: bold;'>" + child + "</span>"
                + "</h1>"
                + "<p style='margin: 5px 0; font-size: 16px; opacity: 0.9;'>Hãy chuẩn bị cho ngày quan trọng hôm nay!</p>"
                + "</div>"

                // Nội dung chính
                + "<div style='padding: 25px; color: #333; line-height: 1.7;'>"
                + "<p style='animation: slideUp 1s ease-out;'>Chào <b style='color: #2c3e50;'>" + customerName + "</b>,</p>"
                + "<p style='animation: slideUp 1.2s ease-out;'>Hôm nay, ngày <span style='color: #e74c3c; font-weight: bold;'>" + date + "</span>, "
                + "bé <b>" + child + "</b> có lịch tiêm vaccine <b style='color: #3498db; text-decoration: underline;'>" + vaccineName + "</b>.</p>"
                + "<p style='animation: slideUp 1.4s ease-out;'>Đây là một cột mốc quan trọng trong hành trình phát triển khỏe mạnh của bé. "
                + "Vaccine sẽ giúp bảo vệ bé khỏi các bệnh nguy hiểm và tăng cường hệ miễn dịch.</p>"
                + "<div style='background: #fff3e6; padding: 15px; border-radius: 8px; margin: 15px 0; animation: slideUp 1.6s ease-out;'>"
                + "<p style='margin: 0;'><b>Lưu ý quan trọng:</b></p>"
                + "<ul style='margin: 10px 0 0 20px;'>"
                + "<li>Đến đúng giờ tại địa điểm đã đăng ký để tránh chờ đợi.</li>"
                + "<li>Mang theo sổ tiêm chủng của bé và giấy tờ tùy thân.</li>"
                + "<li>Đảm bảo bé không sốt hoặc ốm trước khi tiêm.</li>"
                + "</ul>"
                + "</div>"
                + "<p style='animation: slideUp 1.8s ease-out;'>Nếu có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ qua hotline: "
                + "<b style='color: #e74c3c; cursor: pointer; animation: pulse 2s infinite;'>" + supportPhone + "</b>.</p>"
                + "</div>"

                // Footer
                + "<div style='background: #34495e; color: #ecf0f1; padding: 20px; text-align: center; font-size: 14px;'>"
                + "<p style='margin: 5px 0; font-weight: bold;'>" + companyName + "</p>"
                + "<p style='margin: 5px 0;'>" + companyAddress + "</p>"
                + "<p style='margin: 5px 0;'>📧 <a href='mailto:" + companyEmail + "' style='color: #2ecc71; text-decoration: none;'>"
                + companyEmail + "</a></p>"
                + "<p style='margin: 5px 0;'>📞 <b>" + companyPhone + "</b></p>"
                + "<p style='margin-top: 10px; font-size: 12px; opacity: 0.8;'>Email này được gửi tự động, vui lòng không trả lời trực tiếp.</p>"
                + "</div>"

                + "</div>"
                + "</body>"
                + "</html>";

        sendEmail(to, subject, body);
    }

    public void sendReminderLaterEmail(String to, String child, String customerName, String vaccineName) throws MessagingException {
        String subject = "Nhắc Nhở Lịch Tiêm Chủng Đã Qua - Bé " + child;
        String body = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<style>"
                + "@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }"
                + "@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }"
                + "@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }"
                + "</style>"
                + "</head>"
                + "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f4f8;'>"
                + "<div style='max-width: 650px; margin: 20px auto; background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%); "
                + "border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden; animation: fadeIn 1s ease-in;'>"

                // Header
                + "<div style='background: linear-gradient(to right, #e74c3c, #c0392b); padding: 25px; text-align: center; color: white;'>"
                + "<h1 style='margin: 0; font-size: 26px; animation: slideUp 0.8s ease-out;'>"
                + "⚠️ Nhắc Nhở Tiêm Chủng Đã Qua - Bé <span style='text-transform: uppercase; font-weight: bold;'>" + child + "</span>"
                + "</h1>"
                + "<p style='margin: 5px 0; font-size: 16px; opacity: 0.9;'>Hãy sắp xếp thời gian sớm nhất có thể!</p>"
                + "</div>"

                // Nội dung chính
                + "<div style='padding: 25px; color: #333; line-height: 1.7;'>"
                + "<p style='animation: slideUp 1s ease-out;'>Chào <b style='color: #2c3e50;'>" + customerName + "</b>,</p>"
                + "<p style='animation: slideUp 1.2s ease-out;'>Chúng tôi nhận thấy lịch tiêm vaccine <b style='color: #3498db; text-decoration: underline;'>"
                + vaccineName + "</b> của bé <b>" + child + "</b> đã qua thời gian đăng ký.</p>"
                + "<p style='animation: slideUp 1.4s ease-out;'>Việc tiêm chủng đúng lịch là rất quan trọng để đảm bảo sức khỏe cho bé, "
                + "giúp bảo vệ bé khỏi các bệnh nguy hiểm có thể phòng ngừa được.</p>"
                + "<div style='background: #ffe6e6; padding: 15px; border-radius: 8px; margin: 15px 0; animation: slideUp 1.6s ease-out;'>"
                + "<p style='margin: 0; color: #c0392b;'><b>Thông tin quan trọng:</b></p>"
                + "<ul style='margin: 10px 0 0 20px;'>"
                + "<li>Vui lòng đến trung tâm tiêm chủng đã đăng ký trong thời gian sớm nhất.</li>"
                + "<li>Nếu quá hạn quá lâu (thường là 7-14 ngày), lịch hẹn có thể bị hủy tự động.</li>"
                + "<li>Mang theo sổ tiêm chủng và liên hệ trước để xác nhận lịch mới.</li>"
                + "</ul>"
                + "</div>"
                + "<p style='animation: slideUp 1.8s ease-out;'>Nếu cần hỗ trợ, vui lòng liên hệ hotline: "
                + "<b style='color: #e74c3c; cursor: pointer; animation: pulse 2s infinite;'>" + supportPhone + "</b>.</p>"
                + "</div>"

                // Footer
                + "<div style='background: #2c3e50; color: #ecf0f1; padding: 20px; text-align: center; font-size: 14px;'>"
                + "<p style='margin: 5px 0; font-weight: bold;'>" + companyName + "</p>"
                + "<p style='margin: 5px 0;'>" + companyAddress + "</p>"
                + "<p style='margin: 5px 0;'>📧 <a href='mailto:" + companyEmail + "' style='color: #e74c3c; text-decoration: none;'>"
                + companyEmail + "</a></p>"
                + "<p style='margin: 5px 0;'>📞 <b>" + companyPhone + "</b></p>"
                + "<p style='margin-top: 10px; font-size: 12px; opacity: 0.8;'>Email này được gửi tự động, vui lòng không trả lời trực tiếp.</p>"
                + "</div>"

                + "</div>"
                + "</body>"
                + "</html>";

        sendEmail(to, subject, body);
    }

    public void sendCancelEmail(String to, String child, String customerName, Date date, String vaccineName) throws MessagingException {
        String subject = "Thông Báo Hủy Lịch Tiêm Chủng - Bé " + child;
        String body = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<style>"
                + "@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }"
                + "@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }"
                + "@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }"
                + "</style>"
                + "</head>"
                + "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f4f8;'>"
                + "<div style='max-width: 650px; margin: 20px auto; background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%); "
                + "border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden; animation: fadeIn 1s ease-in;'>"

                // Header
                + "<div style='background: linear-gradient(to right, #e74c3c, #d63031); padding: 25px; text-align: center; color: white;'>"
                + "<h1 style='margin: 0; font-size: 26px; animation: slideUp 0.8s ease-out;'>"
                + "⚠️ Lịch Tiêm Chủng Bé <span style='text-transform: uppercase; font-weight: bold;'>" + child + "</span> Đã Bị Hủy"
                + "</h1>"
                + "<p style='margin: 5px 0; font-size: 16px; opacity: 0.9;'>Vui lòng đọc thông tin chi tiết bên dưới.</p>"
                + "</div>"

                // Nội dung chính
                + "<div style='padding: 25px; color: #333; line-height: 1.7;'>"
                + "<p style='animation: slideUp 1s ease-out;'>Chào <b style='color: #2c3e50;'>" + customerName + "</b>,</p>"
                + "<p style='animation: slideUp 1.2s ease-out;'>Chúng tôi rất tiếc phải thông báo rằng lịch tiêm chủng của bé <b>" + child + "</b> "
                + "vào ngày <span style='color: #e74c3c; font-weight: bold;'>" + date + "</span> với vaccine "
                + "<b style='color: #3498db; text-decoration: underline;'>" + vaccineName + "</b> đã bị <b style='color: #e74c3c;'>HỦY</b> "
                + "do quá thời gian cho phép.</p>"
                + "<p style='animation: slideUp 1.4s ease-out;'>Việc này xảy ra để đảm bảo quy trình tiêm chủng được thực hiện đúng cách "
                + "và hiệu quả cao nhất cho bé. Chúng tôi rất mong quý khách thông cảm.</p>"
                + "<div style='background: #ffe6e6; padding: 15px; border-radius: 8px; margin: 15px 0; animation: slideUp 1.6s ease-out;'>"
                + "<p style='margin: 0; color: #c0392b;'><b>Hành động cần thực hiện:</b></p>"
                + "<ul style='margin: 10px 0 0 20px;'>"
                + "<li>Liên hệ ngay với chúng tôi qua hotline <b>" + supportPhone + "</b> để đặt lịch mới.</li>"
                + "<li>Chuẩn bị sổ tiêm chủng và kiểm tra sức khỏe bé trước khi đến.</li>"
                + "<li>Lịch mới cần được đăng ký trong vòng 7 ngày để đảm bảo lộ trình tiêm chủng.</li>"
                + "</ul>"
                + "</div>"
                + "<p style='animation: slideUp 1.8s ease-out;'>📌 <b>Lưu ý quan trọng:</b> Tiêm chủng đúng hạn là yếu tố then chốt giúp bé "
                + "phát triển khỏe mạnh và được bảo vệ tốt nhất.</p>"
                + "<p style='animation: slideUp 2s ease-out;'>Nếu cần hỗ trợ ngay lập tức, hãy gọi: "
                + "<b style='color: #e74c3c; cursor: pointer; animation: pulse 2s infinite;'>" + supportPhone + "</b>. "
                + "Chúng tôi rất mong được hỗ trợ bạn!</p>"
                + "</div>"

                // Footer
                + "<div style='background: #2c3e50; color: #ecf0f1; padding: 20px; text-align: center; font-size: 14px;'>"
                + "<p style='margin: 5px 0; font-weight: bold;'>" + companyName + "</p>"
                + "<p style='margin: 5px 0;'>" + companyAddress + "</p>"
                + "<p style='margin: 5px 0;'>📧 <a href='mailto:" + companyEmail + "' style='color: #e74c3c; text-decoration: none;'>"
                + companyEmail + "</a></p>"
                + "<p style='margin: 5px 0;'>📞 <b>" + companyPhone + "</b></p>"
                + "<p style='margin-top: 15px; font-size: 12px; opacity: 0.8;'><i>" + signature + "</i></p>"
                + "<p style='margin: 5px 0; font-size: 12px; opacity: 0.8;'>Email này được gửi tự động, vui lòng không trả lời trực tiếp.</p>"
                + "</div>"

                + "</div>"
                + "</body>"
                + "</html>";

        sendEmail(to, subject, body);
    }

}
