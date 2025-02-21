package org.gr1fpt.childvaccinescheduletrackingsystem.payment.vnpay;

import org.gr1fpt.childvaccinescheduletrackingsystem.payment.Payment;
import org.gr1fpt.childvaccinescheduletrackingsystem.payment.PaymentRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.payment.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
public class VNPAYController  {

      @Autowired
      VNPAYService vnpayService;

      @Autowired
      PaymentService paymentService;

      @Autowired
    PaymentRepository paymentRepository;

    @GetMapping("/vnpay")
    public RedirectView getVnpay(@RequestParam String id, @RequestParam int price) throws UnsupportedEncodingException {
        String paymentUrl = vnpayService.createVnpayUrl(id, price);
        return new RedirectView(paymentUrl);
    }
    @GetMapping("/vnpay-return")
    public ResponseEntity<Map<String, Object>> handleVnPayReturn(@RequestParam Map<String, String> params) {
        Map<String, Object> response = new HashMap<>();

        // Lấy các thông tin quan trọng từ VNPay
        String vnp_Amount = params.get("vnp_Amount"); // Số tiền thanh toán (đơn vị VND * 100)
        String vnp_BankCode = params.get("vnp_BankCode"); // Mã ngân hàng
        String vnp_BankTranNo = params.get("vnp_BankTranNo"); // Mã giao dịch ngân hàng
        String vnp_CardType = params.get("vnp_CardType"); // Loại thẻ
        String vnp_OrderInfo = params.get("vnp_OrderInfo"); // Thông tin đơn hàng
        String vnp_PayDate = params.get("vnp_PayDate"); // Ngày thanh toán (yyyyMMddHHmmss)
        String vnp_ResponseCode = params.get("vnp_ResponseCode"); // Mã phản hồi (00 là thành công)
        String vnp_TransactionNo = params.get("vnp_TransactionNo"); // Mã giao dịch VNPay
        String vnp_TransactionStatus = params.get("vnp_TransactionStatus"); // Trạng thái giao dịch
        String vnp_TxnRef = params.get("vnp_TxnRef"); // Mã đơn hàng
        String vnp_SecureHash = params.get("vnp_SecureHash"); // Mã checksum

        // Kiểm tra mã phản hồi để xác định thanh toán có thành công hay không
        boolean isSuccess = "00".equals(vnp_ResponseCode) && "00".equals(vnp_TransactionStatus);

        // Tạo phản hồi JSON cho FE
        response.put("orderId", vnp_TxnRef);
        response.put("amount", Integer.parseInt(vnp_Amount) / 100); // Chia 100 để lấy đúng đơn vị VND
        response.put("bankCode", vnp_BankCode);
        response.put("bankTransactionNo", vnp_BankTranNo);
        response.put("cardType", vnp_CardType);
        response.put("orderInfo", vnp_OrderInfo);
        response.put("payDate", vnp_PayDate);
        response.put("transactionNo", vnp_TransactionNo);
        response.put("status", isSuccess ? "SUCCESS" : "FAILED");

        //lấy paymentId
        String[] parts = vnp_OrderInfo.split(":");
        String paymentId = parts[1];
        System.out.println(paymentId);
        System.out.println("trang thai" + isSuccess);

        if (isSuccess) {
            Payment payment = paymentService.getPaymentById(paymentId);
            payment.setTransactionId(vnp_TransactionNo);
            payment.setStatus(true);
            paymentRepository.save(payment);
        }
        else
        {
            Payment payment = paymentService.getPaymentById(paymentId);
            payment.setStatus(false);
            paymentRepository.save(payment);
        }

        // Nếu giao dịch thành công, có thể cập nhật trạng thái đơn hàng vào DB ở đây

        return ResponseEntity.ok(response);
    }
}
