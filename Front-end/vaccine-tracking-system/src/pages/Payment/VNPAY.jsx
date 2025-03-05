import { useState } from "react";
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

function VNPAY() {
  const [paymentResult, setPaymentResult] = useState({
    status: "SUCCESS", // Hoặc "FAILURE" nếu thanh toán thất bại
    orderId: "ORD123456",
    amount: 500000,
    bankCode: "Vietcombank",
    bankTransactionNo: "VTC123456789",
    cardType: "VISA",
    orderInfo: "Mua vaccine cho trẻ",
    payDate: "20250304103000", // Ngày giờ thanh toán
    transactionNo: "TRAN123456789",
    formattedPayDate: "04/03/2025, 10:30:00",
  });

  const [showConfetti, setShowConfetti] = useState(
    paymentResult.status === "SUCCESS"
  );

  const Confetti = () => {
    return (
      <div className="confetti-container absolute top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div key={i} className={`confetti confetti-${i % 5} absolute`}></div>
        ))}
      </div>
    );
  };

  return (
    <div className="paymentreturnpage-container bg-light-blue-100 min-h-screen flex items-center justify-center">
      {showConfetti && <Confetti />}
      <div className="paymentreturnpage-card bg-white shadow-lg rounded-lg w-full max-w-2xl p-6">
        <div
          className={`paymentreturnpage-receipt ${
            paymentResult.status === "SUCCESS" ? "bg-green-100" : "bg-red-100"
          } p-6 rounded-lg`}
        >
          <div className="receipt-header flex items-center justify-between mb-6">
            <div className="logo text-2xl font-bold text-blue-600">VNPay</div>
            <h2 className="receipt-title text-xl font-semibold">
              Biên lai thanh toán
            </h2>
            <div className="receipt-status-container flex items-center space-x-2">
              {paymentResult.status === "SUCCESS" ? (
                <div className="receipt-status text-green-500">
                  <FaCheckCircle className="status-icon text-2xl" />
                  <span>Thanh toán thành công</span>
                </div>
              ) : (
                <div className="receipt-status text-red-500">
                  <FaTimesCircle className="status-icon text-2xl" />
                  <span>Thanh toán thất bại</span>
                </div>
              )}
            </div>
          </div>

          <div className="receipt-body mb-6">
            <div className="receipt-amount flex justify-between items-center mb-4">
              {paymentResult.amount && (
                <>
                  <span className="amount-label font-medium text-gray-700">
                    Tổng thanh toán
                  </span>
                  <span className="amount-value font-semibold text-xl text-gray-900">
                    {paymentResult.amount.toLocaleString("vi-VN")} ₫
                  </span>
                </>
              )}
            </div>

            <div className="receipt-divider border-t border-gray-300 mb-4"></div>

            <div className="receipt-details">
              <div className="detail-row flex justify-between items-center mb-3">
                <div className="detail-icon text-lg text-blue-600">
                  <FaReceipt />
                </div>
                <div className="detail-label text-gray-700">Mã đơn hàng:</div>
                <div className="detail-value text-gray-900">
                  {paymentResult.orderId || "N/A"}
                </div>
              </div>

              <div className="detail-row flex justify-between items-center mb-3">
                <div className="detail-icon text-lg text-blue-600">
                  <FaMoneyBillWave />
                </div>
                <div className="detail-label text-gray-700">Mã giao dịch:</div>
                <div className="detail-value text-gray-900">
                  {paymentResult.transactionNo}
                </div>
              </div>

              <div className="detail-row flex justify-between items-center mb-3">
                <div className="detail-icon text-lg text-blue-600">
                  <FaReceipt />
                </div>
                <div className="detail-label text-gray-700">Thông tin:</div>
                <div className="detail-value text-gray-900">
                  {decodeURIComponent(paymentResult.orderInfo)}
                </div>
              </div>

              <div className="detail-row flex justify-between items-center mb-3">
                <div className="detail-icon text-lg text-blue-600">
                  <FaCalendarAlt />
                </div>
                <div className="detail-label text-gray-700">Thời gian:</div>
                <div className="detail-value text-gray-900">
                  {paymentResult.formattedPayDate}
                </div>
              </div>

              {paymentResult.bankCode && (
                <div className="detail-row flex justify-between items-center mb-3">
                  <div className="detail-icon text-lg text-blue-600">
                    <FaUniversity />
                  </div>
                  <div className="detail-label text-gray-700">Ngân hàng:</div>
                  <div className="detail-value text-gray-900">
                    {paymentResult.bankCode}
                  </div>
                </div>
              )}

              {paymentResult.cardType && (
                <div className="detail-row flex justify-between items-center mb-3">
                  <div className="detail-icon text-lg text-blue-600">
                    <FaCreditCard />
                  </div>
                  <div className="detail-label text-gray-700">Loại thẻ:</div>
                  <div className="detail-value text-gray-900">
                    {paymentResult.cardType}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="receipt-footer flex justify-between items-center">
            <div className="receipt-actions">
              <a
                href="/customer/payment"
                className="paymentreturnpage-button bg-blue-500 text-white py-2 px-6 rounded-lg flex items-center hover:bg-blue-600"
              >
                <FaHome className="button-icon mr-2" /> xem trạng thái thanh
                toán
              </a>
              {paymentResult.status === "SUCCESS" && (
                <button
                  onClick={() => window.print()}
                  className="paymentreturnpage-button bg-gray-200 text-gray-800 py-2 px-6 rounded-lg flex items-center mt-2 hover:bg-gray-300"
                >
                  <FaReceipt className="button-icon mr-2" /> In biên lai
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
