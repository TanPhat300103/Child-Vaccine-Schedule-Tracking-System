import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHome,
  FaReceipt,
  FaCreditCard,
  FaCalendarAlt,
  FaUniversity,
  FaMoneyBillWave,
} from "react-icons/fa";
// import "../style/PaymentReturnPage.css";

function VNPAY() {
  const location = useLocation();
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handlePaymentResult = () => {
      // Lấy query parameters từ URL
      const queryParams = new URLSearchParams(location.search);

      // Lấy các thông tin từ query parameters
      const result = {
        status: queryParams.get("status"),
        orderId: queryParams.get("orderId"),
        amount: parseInt(queryParams.get("amount")),
        bankCode: queryParams.get("bankCode"),
        bankTransactionNo: queryParams.get("bankTransactionNo"),
        cardType: queryParams.get("cardType"),
        orderInfo: queryParams.get("orderInfo"),
        payDate: queryParams.get("payDate"),
        transactionNo: queryParams.get("transactionNo"),
      };

      // Format ngày thanh toán (định dạng YYYYMMDDHHmmss -> dễ đọc hơn)
      if (result.payDate) {
        const date = new Date(
          result.payDate.substring(0, 4), // Năm
          parseInt(result.payDate.substring(4, 6)) - 1, // Tháng (trừ 1 vì tháng bắt đầu từ 0)
          result.payDate.substring(6, 8), // Ngày
          result.payDate.substring(8, 10), // Giờ
          result.payDate.substring(10, 12), // Phút
          result.payDate.substring(12, 14) // Giây
        );
        result.formattedPayDate = date.toLocaleString("vi-VN");
      }

      setPaymentResult(result);

      // Bật hiệu ứng confetti nếu thanh toán thành công
      if (result.status === "SUCCESS") {
        setShowConfetti(true);
      }

      setLoading(false);
    };

    // Thêm delay nhỏ để có animation loading
    setTimeout(() => {
      handlePaymentResult();
    }, 1000);
  }, [location]);

  // Hiệu ứng Confetti component
  const Confetti = () => {
    return (
      <div className="confetti-container">
        {[...Array(50)].map((_, i) => (
          <div key={i} className={`confetti confetti-${i % 5}`}></div>
        ))}
      </div>
    );
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="paymentreturnpage-container">
        <div className="spinner-container">
          <div className="spinner"></div>
          <h3 className="loading-text">Đang xử lý kết quả thanh toán...</h3>
        </div>
      </div>
    );
  }

  if (!paymentResult) {
    return (
      <div className="paymentreturnpage-container">
        <div className="paymentreturnpage-card error-card">
          <FaTimesCircle className="error-icon" />
          <h2 className="paymentreturnpage-title">
            Không có dữ liệu kết quả thanh toán.
          </h2>
          <p className="error-message">
            Đã xảy ra lỗi khi xử lý giao dịch của bạn.
          </p>
          <a href="/" className="paymentreturnpage-button">
            <FaHome className="button-icon" /> Quay lại trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="paymentreturnpage-container">
      {showConfetti && <Confetti />}
      <div className="paymentreturnpage-card">
        <div
          className={`paymentreturnpage-receipt ${
            paymentResult.status === "SUCCESS"
              ? "success-receipt"
              : "failure-receipt"
          }`}
        >
          <div className="receipt-header">
            <div className="logo-container">
              <div className="logo">VNPay</div>
            </div>
            <h2 className="receipt-title">Biên lai thanh toán</h2>
            <div className="receipt-status-container">
              {paymentResult.status === "SUCCESS" ? (
                <div className="receipt-status success">
                  <FaCheckCircle className="status-icon" />
                  <span>Thanh toán thành công</span>
                </div>
              ) : (
                <div className="receipt-status failure">
                  <FaTimesCircle className="status-icon" />
                  <span>Thanh toán thất bại</span>
                </div>
              )}
            </div>
          </div>

          <div className="receipt-body">
            <div className="receipt-amount">
              {paymentResult.amount && (
                <>
                  <span className="amount-label">Tổng thanh toán</span>
                  <span className="amount-value">
                    {paymentResult.amount.toLocaleString("vi-VN")} ₫
                  </span>
                </>
              )}
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-details">
              <div className="detail-row">
                <div className="detail-icon">
                  <FaReceipt />
                </div>
                <div className="detail-label">Mã đơn hàng:</div>
                <div className="detail-value">
                  {paymentResult.orderId || "N/A"}
                </div>
              </div>

              {paymentResult.transactionNo && (
                <div className="detail-row">
                  <div className="detail-icon">
                    <FaMoneyBillWave />
                  </div>
                  <div className="detail-label">Mã giao dịch:</div>
                  <div className="detail-value">
                    {paymentResult.transactionNo}
                  </div>
                </div>
              )}

              {paymentResult.orderInfo && (
                <div className="detail-row">
                  <div className="detail-icon">
                    <FaReceipt />
                  </div>
                  <div className="detail-label">Thông tin:</div>
                  <div className="detail-value">
                    {decodeURIComponent(paymentResult.orderInfo)}
                  </div>
                </div>
              )}

              {paymentResult.formattedPayDate && (
                <div className="detail-row">
                  <div className="detail-icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="detail-label">Thời gian:</div>
                  <div className="detail-value">
                    {paymentResult.formattedPayDate}
                  </div>
                </div>
              )}

              {paymentResult.status === "SUCCESS" && paymentResult.bankCode && (
                <div className="detail-row">
                  <div className="detail-icon">
                    <FaUniversity />
                  </div>
                  <div className="detail-label">Ngân hàng:</div>
                  <div className="detail-value">{paymentResult.bankCode}</div>
                </div>
              )}

              {paymentResult.status === "SUCCESS" && paymentResult.cardType && (
                <div className="detail-row">
                  <div className="detail-icon">
                    <FaCreditCard />
                  </div>
                  <div className="detail-label">Loại thẻ:</div>
                  <div className="detail-value">{paymentResult.cardType}</div>
                </div>
              )}
            </div>
          </div>

          <div className="receipt-footer">
            <div className="receipt-actions">
              <a href="/" className="paymentreturnpage-button primary-button">
                <FaHome className="button-icon" /> Quay lại trang chủ
              </a>
              {paymentResult.status === "SUCCESS" && (
                <button
                  onClick={() => window.print()}
                  className="paymentreturnpage-button secondary-button"
                >
                  <FaReceipt className="button-icon" /> In biên lai
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VNPAY;
