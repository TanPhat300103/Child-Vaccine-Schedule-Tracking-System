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
      try {
        const response = await fetch(
          "http://localhost:8080/staffdashboard/get-booking-today",
          { method: "GET", credentials: "include" }
        );
        if (!response.ok) throw new Error("Lỗi khi lấy lịch hẹn hôm nay");
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
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
              key={booking.bookingDetailId}
              className="booking-card-bookingtoday"
              onClick={() =>
                navigate(`../booking-detail/${booking.bookingDetailId}`)
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
