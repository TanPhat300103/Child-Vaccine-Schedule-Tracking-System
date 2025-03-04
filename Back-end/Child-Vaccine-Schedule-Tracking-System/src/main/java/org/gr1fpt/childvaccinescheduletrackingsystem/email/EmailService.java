package org.gr1fpt.childvaccinescheduletrackingsystem.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.gr1fpt.childvaccinescheduletrackingsystem.vaccine.Vaccine;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.text.SimpleDateFormat;
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


    public void sendBookingConfirmationEmail(String to, String child, String bookingDate, String customerName) throws MessagingException {

        String currentTime = LocalDateTime.now().format(dateTimeFormatter);

        String subject = "Xác nhận đặt lịch thành công - Dịch vụ của " + companyName;

        String body = "<html>" +
                "<body style='font-family: Arial, sans-serif; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4;'>" +
                "  <table align='center' style='width: 600px; max-width: 600px; border-collapse: collapse; margin: 20px auto; background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%); box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 10px; overflow: hidden;'>" +
                "    <tr>" +
                "      <td style='background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;'>" +
                "        <h2 style='color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; animation: fadeIn 1s ease-in;'>" +
                "          Xác Nhận Đặt Lịch Thành Công" +
                "        </h2>" +
                "      </td>" +
                "    </tr>" +
                "    <tr>" +
                "      <td style='padding: 30px;'>" +
                "        <p style='font-size: 16px; line-height: 1.6;'>Chào <span style='color: #4CAF50; font-weight: bold;'>" + customerName + "</span>,</p>" +
                "        <p style='font-size: 16px; line-height: 1.6;'>Chúng tôi xin trân trọng thông báo rằng Quý khách đã đặt lịch thành công cho dịch vụ của <strong style='color: #2c7be5;'>" + companyName + "</strong>.</p>" +
                "        <table style='width: 100%; margin: 20px 0; border-left: 4px solid #4CAF50; padding-left: 15px; background: #f1f8f1; border-radius: 5px; transition: all 0.3s ease;'>" +
                "          <tr><td><strong>Ngày đặt lịch:</strong></td><td>" + currentTime + "</td></tr>" +
                "          <tr><td><strong>Thông tin trẻ:</strong></td><td>" + child + "</td></tr>" +
                "          <tr><td><strong>Ngày hẹn:</strong></td><td style='color: #e67e22; font-weight: bold;'>" + bookingDate + "</td></tr>" +
                "        </table>" +
                "        <p style='font-size: 14px; line-height: 1.6; color: #666666; margin: 20px 0;'>Nếu Quý khách không thực hiện yêu cầu đặt lịch này, xin vui lòng liên hệ ngay với Tổng đài hỗ trợ qua số điện thoại <a href='tel:" + supportPhone + "' style='color: #4CAF50; text-decoration: none; font-weight: bold; transition: color 0.3s ease;'>" + supportPhone + "</a> để được tư vấn và hỗ trợ kịp thời.</p>" +
                "        <p style='font-size: 16px; line-height: 1.6; margin: 20px 0;'>Chúng tôi rất vinh hạnh được phục vụ Quý khách và mong rằng Quý khách sẽ có trải nghiệm tuyệt vời với dịch vụ của chúng tôi.</p>" +
                "        <p style='font-size: 16px; margin: 20px 0 0;'>Trân trọng,</p>" +
                "        <p style='font-size: 16px; color: #2c7be5; margin: 5px 0 20px; font-weight: bold;'>" + signature + "</p>" +
                "      </td>" +
                "    </tr>" +
                "    <tr>" +
                "      <td style='background: #eef4ed; padding: 15px; text-align: center; border-top: 1px solid #dddddd;'>" +
                "        <p style='font-size: 12px; color: #777777; margin: 5px 0;'>" +
                "          Địa chỉ: " + companyAddress + "<br>" +
                "          Email: <a href='mailto:" + companyEmail + "' style='color: #4CAF50; text-decoration: none;'>" + companyEmail + "</a> | Điện thoại: " + companyPhone +
                "        </p>" +
                "      </td>" +
                "    </tr>" +
                "  </table>" +
                "  <style>" +
                "    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }" +
                "    a:hover { color: #2c7be5 !important; }" +
                "    table tr:hover { background: #e8f4e8; }" +
                "  </style>" +
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

    public void sendOtpEmail(String to, String otp) throws MessagingException {
        String subject = "Your OTP Code";
        String body = "<p>Your OTP code is: <b>" + otp + "</b></p>"
                + "<p>Thank you!</p>";

        sendEmail(to, subject, body);
    }

    public void senPaymentEmail(String to, String customerName, Date date, int total, String transactionId, boolean method, String customerCode, String address) throws MessagingException {
        String subject = "Hóa Đơn Điện Tử - " + transactionId;
        String paymentMethod = method ? "Thẻ tín dụng" : "Tiền mặt";
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

        String taxCode = "0123456789"; // Mã số thuế công ty
        String serviceDescription = "Dịch vụ tiêm chủng"; // Chỉ giữ 1 dịch vụ

        String body = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<style>"
                + "@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }"
                + "@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }"
                + "@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }"
                + "table { width: 100%; border-collapse: collapse; margin: 20px 0; }"
                + "th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }"
                + "th { background: #f8f9fa; color: #333; font-weight: bold; }"
                + "td { color: #555; }"
                + ".info-section { display: flex; justify-content: space-between; margin-bottom: 20px; }"
                + ".info-box { width: 48%; padding: 15px; border: 1px solid #e0e0e0; border-radius: 5px; background: #ffffff; }"
                + ".info-box h3 { margin: 0 0 10px 0; font-size: 14px; color: #007bff; font-weight: 600; text-transform: uppercase; }"
                + ".info-box p { margin: 5px 0; font-size: 13px; color: #555; line-height: 1.5; }"
                + ".info-box .label { color: #777; font-weight: 500; }"
                + "</style>"
                + "</head>"
                + "<body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f0f4f8;'>"
                + "<div style='max-width: 650px; margin: 20px auto; background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%); "
                + "border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden; animation: fadeIn 1s ease-in;'>"

                // Header (giữ nguyên)
                + "<div style='background: linear-gradient(to right, #27ae60, #2ecc71); padding: 25px; text-align: center; color: white;'>"
                + "<h1 style='margin: 0; font-size: 26px; animation: slideUp 0.8s ease-out;'>"
                + "✅ Hóa Đơn Điện Tử - <span style='font-weight: bold;'>" + transactionId + "</span>"
                + "</h1>"
                + "<p style='margin: 5px 0; font-size: 16px; opacity: 0.9;'>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>"
                + "</div>"

                // Nội dung chính
                + "<div style='padding: 25px; color: #333; line-height: 1.7;'>"
                // Thông tin tổ chức và khách hàng (thiết kế lại)
                + "<div class='info-section' style='animation: slideUp 1s ease-out;'>"
                + "<div class='info-box'>"
                + "<h3>Đơn vị phát hành</h3>"
                + "<p class='label'>Tên đơn vị:</p>"
                + "<p>" + companyName + "</p>"
                + "<p class='label'>Địa chỉ:</p>"
                + "<p>" + companyAddress + "</p>"
                + "<p class='label'>Mã số thuế:</p>"
                + "<p>" + taxCode + "</p>"
                + "<p class='label'>Hotline:</p>"
                + "<p>" + companyPhone + "</p>"
                + "</div>"
                + "<div class='info-box'>"
                + "<h3>Thông tin khách hàng</h3>"
                + "<p class='label'>Họ và tên:</p>"
                + "<p>" + customerName + "</p>"
                + "<p class='label'>Mã khách hàng:</p>"
                + "<p>" + customerCode + "</p>"
                + "<p class='label'>Địa chỉ:</p>"
                + "<p>" + address + "</p>"
                + "<p class='label'>Email:</p>"
                + "<p>" + to + "</p>"
                + "</div>"
                + "</div>"

                // Ngày giao dịch
                + "<p style='animation: slideUp 1.2s ease-out; margin-top: 15px;'>"
                + "Ngày phát hành hóa đơn: <b style='color: #27ae60;'>" + dateFormat.format(date) + "</b></p>"

                // Bảng chi tiết hóa đơn
                + "<table style='animation: slideUp 1.4s ease-out;'>"
                + "<tr>"
                + "<th style='width: 50%;'>Mô tả dịch vụ</th>"
                + "<th style='width: 25%;'>Phương thức</th>"
                + "<th style='width: 25%; text-align: right;'>Số tiền</th>"
                + "</tr>"
                + "<tr>"
                + "<td>" + serviceDescription + "</td>"
                + "<td>" + paymentMethod + "</td>"
                + "<td style='text-align: right;'>" + String.format("%,d VND", total) + "</td>"
                + "</tr>"
                + "<tr style='font-weight: bold;'>"
                + "<td colspan='2'>Tổng cộng</td>"
                + "<td style='text-align: right; color: #27ae60;'>" + String.format("%,d VND", total) + "</td>"
                + "</tr>"
                + "</table>"

                // Ghi chú
                + "<p style='animation: slideUp 1.6s ease-out; font-size: 13px; color: #666;'>"
                + "📌 Đây là hóa đơn điện tử hợp lệ theo quy định pháp luật, có giá trị tương đương hóa đơn giấy. "
                + "Vui lòng lưu trữ email này để đối chiếu khi cần thiết."
                + "</p>"
                // Dòng liên hệ (giữ nguyên nhưng thêm hiệu ứng)
                + "<p style='animation: slideUp 1.8s ease-out; font-size: 13px; color: #333; background: #e8f8f5; padding: 10px; border-radius: 5px;'>"
                + "<b>Hỗ trợ khách hàng:</b> Vui lòng liên hệ hotline <span style='color: #27ae60; font-weight: bold;'>0563785425</span> "
                + "hoặc email <a href='mailto:khangqhse184031@fpt.edu.vn' style='color: #3498db; text-decoration: none;'>khangqhse184031@fpt.edu.vn</a> "
                + "và <a href='mailto:hanptse184261@fpt.edu.vn' style='color: #3498db; text-decoration: none;'>hanptse184261@fpt.edu.vn</a>."
                + "</p>"
                + "</div>"

                // Footer (giữ nguyên)
                + "<div style='background: #2c3e50; color: #ecf0f1; padding: 20px; text-align: center; font-size: 14px;'>"
                + "<p style='margin: 5px 0; font-weight: bold;'>" + companyName + "</p>"
                + "<p style='margin: 5px 0;'>" + companyAddress + "</p>"
                + "<p style='margin: 5px 0;'>📧 <a href='mailto:" + companyEmail + "' style='color: #27ae60; text-decoration: none;'>"
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
