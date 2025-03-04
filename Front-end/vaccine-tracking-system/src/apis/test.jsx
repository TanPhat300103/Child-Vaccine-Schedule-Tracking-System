import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../style/PaymentProcess.css";
import {
  CreditCard,
  Wallet,
  ChevronRight,
  Check,
  AlertTriangle,
} from "lucide-react";
import Select from "react-select";

function PaymentProcessPage() {
  const { paymentId } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponData, setCouponData] = useState(null);
  const [banks] = useState([
    "Vietcombank",
    "Techcombank",
    "Bidv",
    "VPBank",
    "MBBank",
    "TPBank",
    "NCB",
    "Agribank",
    "Eximbank",
    "Scb",
  ]);
  const [selectedBank, setSelectedBank] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationStatus, setConfirmationStatus] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [couponStatus, setCouponStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bankOptions = [
    {
      value: "Vietcombank",
      label: "VCB",
      icon: "https://hienlaptop.com/wp-content/uploads/2024/12/logo-vietcombank-vector-11.png",
    },
    {
      value: "Techcombank",
      label: "TCB",
      icon: "https://plus.vtc.edu.vn/wp-content/uploads/2020/09/techcombank.png",
    },
    {
      value: "Bidv",
      label: "BIDV",
      icon: "https://diadiembank.com/wp-content/uploads/2024/11/icon-bidv-smartbanking.svg",
    },
    {
      value: "VPBank",
      label: "VPBank",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd&AQ6RwsYuDPp1ZlmeUwSBcdMZFmNFgcDplEDxJcig&s",
    },
    {
      value: "MBBank",
      label: "MBBank",
      icon: "https://www.mbbank.com.vn/images/logo.png",
    },
    {
      value: "TPBank",
      label: "TPBank",
      icon: "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-TPBank.png",
    },
    {
      value: "NCB",
      label: "NCB",
      icon: "https://uudai.ncb-bank.vn/images/common/logo_loading.png",
    },
    {
      value: "Agribank",
      label: "Agribank",
      icon: "https://www.inlogo.vn/wp-content/uploads/2023/04/logo-agribank.png",
    },
    {
      value: "Eximbank",
      label: "Eximbank",
      icon: "https://image.sggp.org.vn/w1000/Uploaded/2025/nkdkswkqoc/original/2012/01/images406537_1.jpg.webp",
    },
    {
      value: "Scb",
      label: "SCB",
      icon: "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-SCB.png",
    },
  ];

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "auto",
      minWidth: "200px",
      border: "2px solid #e9ecef",
      borderRadius: "10px",
      backgroundColor: "#fcfcfc",
      padding: "2px",
      boxShadow: "none",
      transition: "all 0.3s ease",
      "&:hover": {
        borderColor: "#ced4da",
      },
      "&:focus": {
        borderColor: "#4361ee",
        boxShadow: "0 0 0 3px rgba(67, 97, 238, 0.2)",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      gap: "10px",
      backgroundColor: state.isSelected ? "#eef1ff" : "#fff",
      color: "#2b2d42",
      "&:hover": {
        backgroundColor: "#f8f9fa",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }),
  };

  const formatOptionLabel = ({ label, icon }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img
        src={icon}
        alt={`${label} logo`}
        style={{ width: "20px", height: "20px" }}
      />
      <span>{label}</span>
    </div>
  );

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        setTimeout(async () => {
          const response = await fetch(
            `http://localhost:8080/payment/findbyid?id=${paymentId}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          if (!response.ok) throw new Error("Không tìm thấy thông tin hóa đơn");
          const data = await response.json();
          setPayment(data);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Lỗi khi lấy dữ liệu: " + err.message);
        setLoading(false);
      }
    };
    fetchPayment();
  }, [paymentId]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setConfirmationMessage("");
    setConfirmationStatus("");
  };

  const applyCoupon = async () => {
    if (!coupon) return;

    try {
      const response = await fetch(
        `http://localhost:8080/marketing/findbycoupon?coupon=${coupon}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Mã giảm giá không hợp lệ!");
      }

      const data = await response.json();

      if (!data.active) {
        setCouponMessage("Mã giảm giá đã hết hiệu lực!");
        setCouponStatus("pending-paymentprocess");
        setCouponApplied(false);
        setCouponDiscount(0);
        setCouponData(null);
        return;
      }

      const currentDate = new Date();
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);

      if (currentDate < startTime || currentDate > endTime) {
        setCouponMessage("Mã giảm giá không nằm trong thời gian hiệu lực!");
        setCouponStatus("pending-paymentprocess");
        setCouponApplied(false);
        setCouponDiscount(0);
        setCouponData(null);
        return;
      }

      const discountPercentage = data.discount;
      const discount =
        (payment?.booking?.totalAmount * discountPercentage) / 100 || 0;
      setCouponDiscount(discount);
      setCouponApplied(true);
      setCouponData(data);
      setCouponMessage(
        `Mã giảm giá "${data.coupon}" đã được áp dụng! Giảm ${discountPercentage}%`
      );
      setCouponStatus("success-paymentprocess");
    } catch (err) {
      setCouponMessage(err.message);
      setCouponStatus("pending-paymentprocess");
      setCouponApplied(false);
      setCouponDiscount(0);
      setCouponData(null);
    }
  };

  const getFinalAmount = () => {
    if (!payment?.booking?.totalAmount) return 0;
    return payment.booking.totalAmount - couponDiscount;
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN");
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

    try {
      const method = paymentMethod === "atm";
      const params = new URLSearchParams({
        paymentId: paymentId,
        coupon: coupon || "",
        method: method.toString(),
        bank: selectedBank || "",
      });

      const response = await fetch(
        `http://localhost:8080/payment/update?${params.toString()}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Không thể cập nhật thanh toán");
      }

      const data = await response.json();

      if (method) {
        const { VNPAYURL } = data;
        if (VNPAYURL) {
          setConfirmationMessage("Đang chuyển hướng đến VNPay...");
          setConfirmationStatus("pending-paymentprocess");
          setTimeout(() => {
            window.location.href = VNPAYURL;
          }, 1000);
        } else {
          throw new Error("Không thể tạo URL thanh toán VNPay");
        }
      } else {
        setConfirmationMessage("Đang đợi staff xác nhận thanh toán tiền mặt");
        setConfirmationStatus("pending-paymentprocess");
        setIsSubmitting(false);
      }
    } catch (err) {
      setConfirmationMessage("Lỗi: " + err.message);
      setConfirmationStatus("pending-paymentprocess");
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="loading-paymentprocess">
        Đang tải thông tin hóa đơn...
      </div>
    );

  if (error)
    return (
      <div className="error-paymentprocess">
        <AlertTriangle size={24} style={{ marginRight: "10px" }} />
        {error}
      </div>
    );

  return (
    <div className="payment-process-container-paymentprocess">
      <div className="payment-content-paymentprocess">
        <div className="payment-header-paymentprocess">
          <h1>Thanh Toán Hóa Đơn #{payment?.paymentId}</h1>
          <p>Vui lòng kiểm tra thông tin và chọn phương thức thanh toán</p>
        </div>

        <div className="main-card-paymentprocess">
          <div className="section-paymentprocess invoice-info-paymentprocess">
            <h2>Thông Tin Hóa Đơn</h2>
            <div className="info-grid-paymentprocess">
              <div className="info-item-paymentprocess">
                <span>Mã Booking:</span>
                <span>{payment?.booking?.bookingId}</span>
              </div>
              <div className="info-item-paymentprocess">
                <span>Ngày Booking:</span>
                <span>
                  {payment?.booking
                    ? new Date(payment.booking.bookingDate).toLocaleDateString(
                        "vi-VN"
                      )
                    : ""}
                </span>
              </div>
              <div className="info-item-paymentprocess">
                <span>Tên Khách Hàng:</span>
                <span>
                  {payment?.booking?.customer?.firstName}{" "}
                  {payment?.booking?.customer?.lastName}
                </span>
              </div>
              <div className="info-item-paymentprocess">
                <span>Tổng Tiền:</span>
                <span className="total-amount-paymentprocess">
                  {formatCurrency(payment?.booking?.totalAmount || 0)} VNĐ
                </span>
              </div>
            </div>
          </div>

          <div className="section-paymentprocess payment-form-paymentprocess">
            <h2>Phương Thức Thanh Toán</h2>
            <div className="coupon-section-paymentprocess">
              <label>Mã Coupon (nếu có):</label>
              <div className="coupon-input-group-paymentprocess">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Nhập mã coupon"
                />
                <button onClick={applyCoupon} disabled={!coupon}>
                  {couponApplied ? <Check size={16} /> : "Áp dụng"}
                </button>
              </div>
              {couponMessage && (
                <div
                  className={`confirmation-message-paymentprocess ${couponStatus}`}
                >
                  {couponStatus === "success-paymentprocess" ? (
                    <Check size={18} />
                  ) : (
                    <AlertTriangle size={18} />
                  )}
                  {couponMessage}
                </div>
              )}
            </div>
            <div className="method-section-paymentprocess">
              <h3>Chọn Phương Thức Thanh Toán:</h3>
              <div className="payment-methods-paymentprocess">
                <label
                  className={`method-card-paymentprocess ${
                    paymentMethod === "cash" ? "selected-paymentprocess" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => handlePaymentMethodChange("cash")}
                  />
                  <Wallet size={20} /> Tiền Mặt
                </label>
                <div className="bank-method-wrapper-paymentprocess">
                  <label
                    className={`method-card-paymentprocess ${
                      paymentMethod === "atm" ? "selected-paymentprocess" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      value="atm"
                      checked={paymentMethod === "atm"}
                      onChange={() => handlePaymentMethodChange("atm")}
                    />
                    <CreditCard size={20} /> Thanh Toán Qua Ngân Hàng
                  </label>
                  {paymentMethod === "atm" && (
                    <Select
                      options={bankOptions}
                      value={bankOptions.find(
                        (option) => option.value === selectedBank
                      )}
                      onChange={(selectedOption) =>
                        setSelectedBank(selectedOption?.value || "")
                      }
                      styles={customStyles}
                      formatOptionLabel={formatOptionLabel}
                      placeholder="Chọn ngân hàng"
                      className="bank-select-paymentprocess"
                    />
                  )}
                </div>
              </div>
            </div>
            <button
              className="confirm-btn-paymentprocess"
              onClick={handleConfirm}
              disabled={
                isSubmitting || (paymentMethod === "atm" && !selectedBank)
              }
            >
              {isSubmitting ? "Đang xử lý..." : "Xác Nhận Thanh Toán"}{" "}
              <ChevronRight size={18} />
            </button>
            {confirmationMessage && (
              <div
                className={`confirmation-message-paymentprocess ${confirmationStatus}`}
              >
                {confirmationStatus === "success-paymentprocess" ? (
                  <Check size={18} />
                ) : (
                  <AlertTriangle size={18} />
                )}
                {confirmationMessage}
              </div>
            )}
          </div>
        </div>

        <div className="payment-summary-paymentprocess">
          <h2>Tóm Tắt Thanh Toán</h2>
          <div className="summary-grid-paymentprocess">
            <div className="summary-item-paymentprocess">
              <span>Tổng Hóa Đơn:</span>
              <span>
                {formatCurrency(payment?.booking?.totalAmount || 0)} VNĐ
              </span>
            </div>
            {couponApplied && couponData && (
              <>
                <div className="summary-item-paymentprocess">
                  <span>Phần Trăm Giảm:</span>
                  <span>{couponData.discount}%</span>
                </div>
              </>
            )}
            <div className="summary-item-paymentprocess">
              <span>Giảm Giá:</span>
              <span>
                {couponApplied
                  ? `${formatCurrency(couponDiscount)} VNĐ`
                  : "0 VNĐ"}
              </span>
            </div>
            <div className="summary-item-paymentprocess">
              <span>Thành Tiền:</span>
              <span className="total-amount-paymentprocess">
                {formatCurrency(getFinalAmount())} VNĐ
              </span>
            </div>
          </div>
          <div className="summary-note-paymentprocess">
            <Check size={16} /> Vui lòng kiểm tra kỹ thông tin trước khi thanh
            toán.
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentProcessPage;
