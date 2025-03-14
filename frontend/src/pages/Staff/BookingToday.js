import React, { useState, useEffect } from "react";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../style/BookingToday.css";

const BookingToday = ({ onBack }) => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/staffdashboard/get-booking-today`,
          { method: "GET", credentials: "include" }
        );
        console.log(
          "Request lấy lịch hẹn hôm nay:",
          `${process.env.REACT_APP_API_BASE_URL}/staffdashboard/get-booking-today`
        );
        console.log("Response từ API:", response);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            "Lỗi chi tiết từ API lịch hẹn:",
            response.status,
            response.statusText,
            errorText
          );
          throw new Error(
            `Lỗi khi lấy lịch hẹn hôm nay: ${
              errorText || "Không có thông tin chi tiết từ server"
            }`
          );
        }

        const data = await response.json();
        console.log("Dữ liệu lịch hẹn nhận được:", data);
        setBookings(data);
      } catch (err) {
        console.error("Lỗi tổng quát trong BookingToday:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Hiển thị lỗi trong JSX
    if (error)
      return (
        <div className="error-bookingtoday">
          Có lỗi xảy ra khi tải lịch hẹn. Vui lòng thử lại sau.
        </div>
      );
    fetchBookings();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBookings = bookings.filter((booking) => {
    const term = searchTerm.toLowerCase();
    return (
      booking.booking.bookingId.toLowerCase().includes(term) ||
      booking.booking.customer.customerId.toLowerCase().includes(term) ||
      booking.booking.customer.phoneNumber.toLowerCase().includes(term) ||
      booking.booking.customer.email.toLowerCase().includes(term) ||
      `${booking.child.firstName} ${booking.child.lastName}`
        .toLowerCase()
        .includes(term) ||
      booking.vaccine.name.toLowerCase().includes(term)
    );
  });

  // Hàm chuyển đổi giá trị status thành văn bản
  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Đã đặt";
      case 2:
        return "Đã hoàn thành";
      case 3:
        return "Đã huỷ";
      default:
        return "Không xác định";
    }
  };

  if (loading)
    return <div className="loading-bookingtoday">Đang tải dữ liệu...</div>;
  if (error) return <div className="error-bookingtoday">{error}</div>;

  return (
    <div className="booking-today-container-bookingtoday">
      <div className="booking-today-header-bookingtoday">
        <button className="back-button-bookingtoday" onClick={onBack}>
          <FaArrowLeft /> Quay Lại
        </button>
        <h2>Lịch Hẹn Hôm Nay</h2>
      </div>
      <div className="search-bar-bookingtoday">
        <FaSearch className="search-icon-bookingtoday" />
        <input
          type="text"
          placeholder="Tìm theo mã khách hàng, SDT, email, mã đặt lịch, tên trẻ, vaccine..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input-bookingtoday"
        />
      </div>
      <div className="booking-list-bookingtoday">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking.booking.bookingId}
              className="booking-card-bookingtoday"
              onClick={() =>
                navigate(`/staff/booking-detail/${booking.booking.bookingId}`)
              }
            >
              <div className="booking-card-header-bookingtoday">
                <h3>{booking.vaccine.name}</h3>
                <span className="booking-id-bookingtoday">
                  #{booking.booking.bookingId}
                </span>
              </div>
              <p>
                <strong>Trẻ:</strong> {booking.child.firstName}{" "}
                {booking.child.lastName}
              </p>
              <p>
                <strong>Khách hàng:</strong>{" "}
                {booking.booking.customer.firstName}{" "}
                {booking.booking.customer.lastName}
              </p>
              <p>
                <strong>SDT:</strong> {booking.booking.customer.phoneNumber}
              </p>
              <p>
                <strong>Email:</strong> {booking.booking.customer.email}
              </p>
              <p>
                <strong>Thời gian:</strong>{" "}
                {new Date(booking.scheduledDate).toLocaleDateString()}
              </p>
              <p className="booking-status-bookingtoday">
                <strong>Trạng thái:</strong>{" "}
                {getStatusText(booking.booking.status)}
              </p>
            </div>
          ))
        ) : (
          <div className="no-data-bookingtoday">
            Không có lịch hẹn nào hôm nay
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingToday;
