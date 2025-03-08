import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../CustomerPage/BookingCustomerSchedule.css";
import { BookOpen, Calendar } from "lucide-react";
import { useAuth } from "../../components/common/AuthContext";

function BookingCustomer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get("tab") || "bookings";
  const [activeTab, setActiveTab] = useState(initialTab);

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
          throw new Error("Không tìm thấy thông tin booking");
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      } catch (err) {
        setError("Lỗi khi lấy thông tin: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner"></div>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <div className="profile-error-icon">❌</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Booking</h1>
      </div>

      <div className="profile-main">
        {activeTab === "bookings" && (
          <div className="profile-section" style={{ opacity: 1 }}>
            <div className="profile-section-header">
              <h2>My Booking</h2>
            </div>

            {bookings.length > 0 ? (
              <div className="profile-bookings-grid">
                {bookings.map((booking) => (
                  <Link
                    to={`/booking-detail/${booking.bookingId}`}
                    key={booking.bookingId}
                    className="profile-booking-card"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="profile-booking-header">
                      <div className="profile-booking-info">
                        <h3>Booking #{booking.bookingId}</h3>
                        <p className="profile-booking-date">
                          <Calendar size={14} />
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="profile-booking-details">
                      <div className="profile-booking-detail-item">
                        <span className="profile-booking-detail-label">
                          Trạng thái:
                        </span>
                        <span
                          className={`profile-status ${
                            booking.status === 1 ? "active" : "inactive"
                          }`}
                        >
                          {booking.status === 1
                            ? "Đã xác nhận"
                            : "Chưa xác nhận"}
                        </span>
                      </div>
                      <div className="profile-booking-detail-item">
                        <span className="profile-booking-detail-label">
                          Tổng tiền:
                        </span>
                        <span className="profile-booking-detail-value">
                          {booking.totalAmount.toLocaleString("vi-VN")} VNĐ
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="profile-no-bookings">
                <div className="profile-no-data-icon">📅</div>
                <p>Bạn chưa có booking nào. Vui lòng tạo booking để bắt đầu.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingCustomer;