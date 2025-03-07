import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../CustomerPage/BookingCustomer.css";
import {
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  User,
  BookOpen,
  CreditCard,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import { useAuth } from "../../components/common/AuthContext";
import { FaMoneyCheckAlt } from "react-icons/fa";

function PaymentCustomer() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("payments");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedPaymentId, setExpandedPaymentId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all"); // Bộ lọc trạng thái thanh toán

  const handlePayment = (paymentId) => {
    navigate(`/payment-process/${paymentId}`);
  };
  const handlePaymentClick = (booking) => {
    const bookingData = {
      bookingId: booking.bookingId,
      bookingDate: booking.bookingDate,
      totalAmount: booking.totalAmount,
    };
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
  };
  const handleDownload = (paymentId) => {
    // Placeholder cho chức năng tải hóa đơn
    alert(`Tải xuống hóa đơn #${paymentId} dưới dạng PDF...`);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo?.userId) {
        setError("Không tìm thấy ID người dùng");
        setLoading(false);
        return;
      }

      try {
        const bookingsResponse = await fetch(
          `http://localhost:8080/booking/findbycustomer?customerId=${userInfo.userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!bookingsResponse.ok)
          throw new Error("Không tìm thấy danh sách booking");
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);

        const paymentsResponse = await fetch(
          `http://localhost:8080/payment/getbycustomerid?customerId=${userInfo.userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!paymentsResponse.ok)
          throw new Error("Không tìm thấy danh sách hóa đơn");
        const paymentsData = await paymentsResponse.json();
        console.log("Payments data:", paymentsData);

        const sortedPayments = paymentsData.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setPayments(sortedPayments);
      } catch (err) {
        setError("Lỗi khi lấy dữ liệu: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "profile") {
      navigate("/profile");
    } else if (tab === "children") {
      navigate("/profile");
    } else if (tab === "bookings") {
      setIsDropdownOpen(true);
    } else if (tab === "payments") {
    }
  };

  const handleBookingSelect = (selectedBookingId) => {
    navigate(`/booking-detail/${selectedBookingId}`);
    setIsDropdownOpen(false);
  };

  const togglePaymentDetail = (paymentId) => {
    setExpandedPaymentId((prev) => (prev === paymentId ? null : paymentId));
  };

  const filteredPayments = payments.filter((payment) => {
    if (filterStatus === "all") return true;
    return filterStatus === "paid" ? payment.status : !payment.status;
  });

  if (loading) {
    return (
      <div className="mypayment-loading">
        <div className="mypayment-loading-spinner"></div>
        <p>Đang tải danh sách hóa đơn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mypayment-error">
        <div className="mypayment-error-icon">❌</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mypayment-container">
      <div className="mypayment-content">
        <div className="mypayment-main">
          <div className="mypayment-section">
            <h2 className="mypayment-section-title">Danh Sách Hóa Đơn</h2>
            <div className="mypayment-filter">
              <label>Lọc theo trạng thái: </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả</option>
                <option value="paid">Đã thanh toán</option>
                <option value="unpaid">Chưa thanh toán</option>
              </select>
            </div>
            {filteredPayments.length > 0 ? (
              <div className="mypayment-table-wrapper">
                <table className="mypayment-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Hóa đơn</th>
                      <th>Ngày</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                      <th>Phương thức</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment, index) => {
                      const isExpanded =
                        payment.paymentId === expandedPaymentId;
                      const statusClass = payment.status
                        ? "active"
                        : "inactive";
                      const dueDate = new Date(payment.date);
                      dueDate.setDate(dueDate.getDate() + 7); // Giả lập ngày đến hạn
                      return (
                        <>
                          <tr
                            key={payment.paymentId}
                            className={`mypayment-row ${statusClass}`}
                            onClick={() =>
                              togglePaymentDetail(payment.paymentId)
                            }
                          >
                            <td>{index + 1}</td>
                            <td>Hóa đơn #{payment.paymentId}</td>
                            <td>
                              {new Date(payment.date).toLocaleDateString(
                                "vi-VN"
                              )}
                            </td>
                            <td>{payment.total.toLocaleString("vi-VN")} VNĐ</td>
                            <td>
                              <span
                                className={`mypayment-status ${statusClass}`}
                              >
                                {payment.status
                                  ? "Đã thanh toán"
                                  : "Chưa thanh toán"}
                              </span>
                            </td>
                            <td>
                              {payment.method ? "Chuyển khoản" : "Tại quầy"}
                            </td>
                            <td>
                              {!payment.status && (
                                <NavLink
                                  to="/paymentVnpay"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePaymentClick(payment.booking);
                                  }}
                                  className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg flex justify-center items-center font-medium transition-all hover:from-blue-600 hover:to-blue-700"
                                >
                                  <FaMoneyCheckAlt className="mr-2" /> Thanh
                                  Toán
                                </NavLink>
                              )}
                              <button
                                className="mypayment-download-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(payment.paymentId);
                                }}
                              >
                                <Download size={16} />
                              </button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="mypayment-expanded-row">
                              <td colSpan="7">
                                <div className="mypayment-card-details">
                                  <div className="mypayment-detail-section">
                                    <h4>Thông Tin Booking</h4>
                                    <div className="mypayment-detail-item">
                                      <span className="mypayment-detail-label">
                                        Booking ID:
                                      </span>
                                      <span className="mypayment-detail-value">
                                        {payment.booking.bookingId}
                                      </span>
                                    </div>
                                    <div className="mypayment-detail-item">
                                      <span className="mypayment-detail-label">
                                        Ngày Booking:
                                      </span>
                                      <span className="mypayment-detail-value">
                                        {new Date(
                                          payment.booking.bookingDate
                                        ).toLocaleDateString("vi-VN")}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mypayment-detail-section">
                                    <h4>Thông Tin Thanh Toán</h4>
                                    <div className="mypayment-detail-item">
                                      <span className="mypayment-detail-label">
                                        Hóa đơn ID:
                                      </span>
                                      <span className="mypayment-detail-value">
                                        {payment.paymentId}
                                      </span>
                                    </div>
                                    <div className="mypayment-detail-item">
                                      <span className="mypayment-detail-label">
                                        Ngày thanh toán:
                                      </span>
                                      <span className="mypayment-detail-value">
                                        {payment.status
                                          ? new Date(
                                              payment.date
                                            ).toLocaleDateString("vi-VN")
                                          : "----"}
                                      </span>
                                    </div>
                                    <div className="mypayment-detail-item">
                                      <span className="mypayment-detail-label">
                                        Tổng tiền:
                                      </span>
                                      <span className="mypayment-detail-value">
                                        {payment.total.toLocaleString("vi-VN")}{" "}
                                        VNĐ
                                      </span>
                                    </div>
                                    <div className="mypayment-detail-item">
                                      <span className="mypayment-detail-label">
                                        Phương thức:
                                      </span>
                                      <span className="mypayment-detail-value">
                                        {payment.method
                                          ? "Chuyển khoản"
                                          : "Tại quầy"}
                                      </span>
                                    </div>
                                    <div className="mypayment-detail-item">
                                      <span className="mypayment-detail-label">
                                        Trạng thái:
                                      </span>
                                      <span
                                        className={`mypayment-status ${statusClass}`}
                                      >
                                        {payment.status
                                          ? "Đã thanh toán"
                                          : "Chưa thanh toán"}
                                      </span>
                                    </div>
                                    <div className="mypayment-detail-item">
                                      <span className="mypayment-detail-label">
                                        Mã giao dịch:
                                      </span>
                                      <span className="mypayment-detail-value">
                                        {payment.transactionId || "Không có"}
                                      </span>
                                    </div>
                                    <div className="mypayment-detail-item">
                                      <span className="mypayment-detail-label">
                                        Chiến dịch tiếp thị:
                                      </span>
                                      <span className="mypayment-detail-value">
                                        {payment.marketingCampaign &&
                                        payment.marketingCampaign.coupon
                                          ? payment.marketingCampaign.coupon
                                          : "Không có"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mypayment-no-payments">
                <div className="mypayment-no-data-icon">💳</div>
                <p>Không có hóa đơn nào.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCustomer;
