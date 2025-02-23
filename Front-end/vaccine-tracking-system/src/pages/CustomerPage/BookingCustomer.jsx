// src/pages/Customer/BookingList.jsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getBookingByCustomer } from "../../apis/api";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";

const BookingCustomer = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const customerId = location.state?.customerId;
  console.log("Received customerId in Booking:", customerId);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookingByCustomer(customerId);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Không thể lấy thông tin đặt lịch");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [customerId]);

  if (loading) return <p>Đang tải thông tin đặt lịch...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (bookings.length === 0) return <p>Không có đặt lịch nào</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách đặt lịch</h2>
      {bookings.map((booking) => (
        <div
          key={booking.bookingId}
          className="p-4 border rounded-md shadow-sm"
        >
          <p>
            <strong>Mã đặt lịch:</strong> {booking.bookingId}
          </p>
          <p>
            <strong>Ngày đặt:</strong>{" "}
            {format(new Date(booking.bookingDate), "dd/MM/yyyy")}
          </p>
          <p>
            <strong>Trạng thái:</strong> {booking.status}
          </p>
          <p>
            <strong>Tổng tiền:</strong> {booking.totalAmount}
          </p>
          <NavLink
            to={`/booking/${booking.bookingId}`}
            className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Xem chi tiết
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default BookingCustomer;
