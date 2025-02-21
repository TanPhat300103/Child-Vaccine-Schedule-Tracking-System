package org.gr1fpt.childvaccinescheduletrackingsystem.payment.vnpay;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
public class VNPAYController  {

    @GetMapping("/vnpay")
    public String getvnpay() throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long amount = 19000*100;
        String bankCode = "NCB";

        String vnp_TxnRef = Config.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";

        String vnp_TmnCode = Config.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);

        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", Config.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = Config.hmacSHA512(Config.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = Config.vnp_PayUrl + "?" + queryUrl;

        return paymentUrl;
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

        // Nếu giao dịch thành công, có thể cập nhật trạng thái đơn hàng vào DB ở đây

        return ResponseEntity.ok(response);
    }
}
