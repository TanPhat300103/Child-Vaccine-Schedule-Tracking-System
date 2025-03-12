package org.gr1fpt.childvaccinescheduletrackingsystem.payment.vnpay;

import jakarta.servlet.http.HttpServletResponse;
import org.gr1fpt.childvaccinescheduletrackingsystem.notification.Notification;
import org.gr1fpt.childvaccinescheduletrackingsystem.notification.NotificationService;
import org.gr1fpt.childvaccinescheduletrackingsystem.payment.Payment;
import org.gr1fpt.childvaccinescheduletrackingsystem.payment.PaymentRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.payment.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

@RestController
public class VNPAYController  {

      @Autowired
      VNPAYService vnpayService;

      @Autowired
      PaymentService paymentService;

      @Autowired
      ApplicationEventPublisher applicationEventPublisher;

      @Autowired
    PaymentRepository paymentRepository;

      @Autowired
      NotificationService notificationService;

    @GetMapping("/vnpay")
    public RedirectView getVnpay(@RequestParam String id, @RequestParam int price, String bankCode) throws UnsupportedEncodingException {
        String paymentUrl = vnpayService.createVnpayUrl(id, price,bankCode);
        return new RedirectView(paymentUrl);
    }
    @GetMapping("/vnpay-return")
    public void handleVnPayReturn(@RequestParam Map<String, String> params, HttpServletResponse httpResponse) throws IOException, UnsupportedEncodingException {
        Map<String, Object> response = new HashMap<>();

        // Lấy các thông tin quan trọng từ VNPay
        String vnp_Amount = params.get("vnp_Amount");
        String vnp_BankCode = params.get("vnp_BankCode");
        String vnp_BankTranNo = params.get("vnp_BankTranNo");
        String vnp_CardType = params.get("vnp_CardType");
        String vnp_OrderInfo = params.get("vnp_OrderInfo");
        String vnp_PayDate = params.get("vnp_PayDate");
        String vnp_ResponseCode = params.get("vnp_ResponseCode");
        String vnp_TransactionNo = params.get("vnp_TransactionNo");
        String vnp_TransactionStatus = params.get("vnp_TransactionStatus");
        String vnp_TxnRef = params.get("vnp_TxnRef");
        String vnp_SecureHash = params.get("vnp_SecureHash");

        // Kiểm tra mã phản hồi để xác định thanh toán có thành công hay không
        boolean isSuccess = "00".equals(vnp_ResponseCode) && "00".equals(vnp_TransactionStatus);

        // Tạo dữ liệu để gửi về frontend
        response.put("orderId", vnp_TxnRef);
        response.put("amount", Integer.parseInt(vnp_Amount) / 100);
        response.put("bankCode", vnp_BankCode);
        response.put("bankTransactionNo", vnp_BankTranNo);
        response.put("cardType", vnp_CardType);
        response.put("orderInfo", vnp_OrderInfo);
        response.put("payDate", vnp_PayDate);
        response.put("transactionNo", vnp_TransactionNo);
        response.put("status", isSuccess ? "SUCCESS" : "FAILED");

        // Lấy paymentId từ vnp_OrderInfo
        String[] parts = vnp_OrderInfo.split(":");
        String paymentId = parts[1];
        System.out.println(paymentId);
        System.out.println("trang thai: " + isSuccess);

        // Cập nhật trạng thái thanh toán vào database + gửi hoóa đơn vào mail + tạo notification
        if (isSuccess) {
            Payment payment = paymentService.getPaymentById(paymentId);
            payment.setTransactionId(vnp_TransactionNo);
            payment.setStatus(true);
            payment.setDate(Date.valueOf(LocalDate.now()));
            applicationEventPublisher.publishEvent(payment);

            Notification notification = new Notification();
            notification.setCustomer(payment.getBooking().getCustomer());
            notification.setMessage("Đã thanh toán xong. Bạn có góp ý gì cho chúng tôi không? ");
            notificationService.createNotificationAfterPayment(notification);
            paymentRepository.save(payment);
        } else {
            Payment payment = paymentService.getPaymentById(paymentId);
            payment.setStatus(false);
            //Tháo coupon và set price về lại giá gốc
            if (payment.getMarketingCampaign() != null) {
            payment.setTotal(payment.getTotal()/(100-payment.getMarketingCampaign().getDiscount())*100);
            payment.setMarketingCampaign(null);
            }
            paymentRepository.save(payment);
        }

        // Redirect về frontend với thông tin giao dịch qua query parameters
        String redirectUrl = "http://localhost:3000/payment-return?"
                + "status=" + (isSuccess ? "SUCCESS" : "FAILED")
                + "&orderId=" + vnp_TxnRef
                + "&amount=" + (Integer.parseInt(vnp_Amount) / 100)
                + "&bankCode=" + vnp_BankCode
                + "&bankTransactionNo=" + (vnp_BankTranNo != null ? vnp_BankTranNo : "")
                + "&cardType=" + (vnp_CardType != null ? vnp_CardType : "")
                + "&orderInfo=" + URLEncoder.encode(vnp_OrderInfo, StandardCharsets.UTF_8.toString())
                + "&payDate=" + vnp_PayDate
                + "&transactionNo=" + vnp_TransactionNo;

        httpResponse.sendRedirect(redirectUrl);
    }
}
