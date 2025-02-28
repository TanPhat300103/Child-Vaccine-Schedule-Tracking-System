// src/pages/Customer/BookingList.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getBookingByCustomerId,
  getBookingDetailByBooking,
  cancelBooking,
  rescheduleBooking,
} from "../../apis/api";
import { format } from "date-fns";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import isSameDay from "date-fns/isSameDay";

const BookingCustomer = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(1); // 1: Đang Xử Lý, 2: Đã Thanh Toán, 3: Đã Huỷ
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const location = useLocation();
  const customerId = location.state?.customerId;
  console.log("Received customerId in Booking:", customerId);

  // Lấy danh sách booking theo customerId
  const fetchBookings = async () => {
    try {
      const data = await getBookingByCustomerId(customerId);
      setBookings(data);
      console.log("Danh sách booking đã được cập nhật:", data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Không thể lấy thông tin đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchBookings();
    }
  }, [customerId]);

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  // Mở modal chi tiết booking
  const handleCardClick = async (booking) => {
    setSelectedBooking(booking);
    try {
      const details = await getBookingDetailByBooking(booking.bookingId);
      setBookingDetails(details);
      console.log("Chi tiết booking đã được cập nhật:", details);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setBookingDetails([]);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setBookingDetails([]);
    setSelectedBooking(null);
    console.log("Modal chi tiết booking đã đóng.");
  };

  // Gọi API hủy booking
  const handleCancelBooking = async (bookingId, e) => {
    e.stopPropagation();
    try {
      await cancelBooking(bookingId);
      console.log(`Booking ${bookingId} đã được huỷ thành công.`);
      fetchBookings();
    } catch (error) {
      console.error("Lỗi khi huỷ booking:", error);
    }
  };

  // Gọi API đặt lại booking (đổi trạng thái về 1)
  const handleRescheduleBooking = async (bookingId, e) => {
    e.stopPropagation();
    try {
      await rescheduleBooking(bookingId);
      console.log(`Booking ${bookingId} đã được đặt lại thành công.`);
      fetchBookings();
    } catch (error) {
      console.error("Lỗi khi đặt lại booking:", error);
    }
  };

  // Xử lý modal lịch
  const openCalendarModal = () => setShowCalendarModal(true);
  const closeCalendarModal = () => setShowCalendarModal(false);

  if (loading) return <p>Đang tải thông tin đặt lịch...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (bookings.length === 0) return <p>Không có đặt lịch nào</p>;

  // Lọc booking theo trạng thái được chọn
  const filteredBookings = bookings.filter((b) => b.status === selectedStatus);

  // Top filter button labels và styles
  const statusLabels = {
    1: "Đang Xử Lý",
    2: "Đã Thanh Toán",
    3: "Đã Huỷ",
  };

  const statusButtonStyles = {
    1: "bg-blue-500 hover:bg-blue-600",
    2: "bg-green-500 hover:bg-green-600",
    3: "bg-red-500 hover:bg-red-600",
  };

  // Render card booking với hiệu ứng hover và các nút hành động theo trạng thái
  const renderBookingCard = (booking) => (
    <div
      key={booking.bookingId}
      className="p-4 border rounded-md shadow-sm cursor-pointer min-w-[250px] flex-shrink-0 hover:shadow-lg hover:scale-105 transition-transform duration-300"
      onClick={() => handleCardClick(booking)}
    >
      <p className="font-bold">Mã đặt lịch: {booking.bookingId}</p>
      <p>Ngày đặt: {format(new Date(booking.bookingDate), "dd/MM/yyyy")}</p>
      <p>Tổng tiền: {booking.totalAmount.toLocaleString()} VNĐ</p>
      {/* Nút hành động theo trạng thái */}
      {booking.status === 1 && (
        <div className="flex space-x-2 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick(booking);
            }}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Thanh Toán
          </button>
          <button
            onClick={(e) => handleCancelBooking(booking.bookingId, e)}
            className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Huỷ
          </button>
        </div>
      )}
      {booking.status === 2 && (
        <div className="mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick(booking);
            }}
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Feedback
          </button>
        </div>
      )}
      {booking.status === 3 && (
        <div className="mt-2">
          <button
            onClick={(e) => handleRescheduleBooking(booking.bookingId, e)}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Đặt Lại
          </button>
        </div>
      )}
    </div>
  );

  // Tập hợp các ngày đặt lịch để highlight trên calendar
  const bookingDates = bookings.map((b) => new Date(b.bookingDate));

  // Hàm để thêm class cho các ngày có booking
  const tileClassName = ({ date, view }) => {
    if (view === "month" && bookingDates.some((d) => isSameDay(d, date))) {
      return "highlight";
    }
    return null;
  };

  return (
    <div className="p-4">
      {/* Top filter buttons */}
      <div className="flex space-x-4 mb-6">
        {[1, 2, 3].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusClick(status)}
            className={`px-4 py-2 rounded text-white ${
              statusButtonStyles[status]
            } ${
              selectedStatus === status
                ? "ring-4 ring-offset-2 ring-gray-300"
                : ""
            }`}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Booking cards hiển thị theo hàng ngang */}
      {filteredBookings.length > 0 ? (
        <div className="flex space-x-4 overflow-x-auto">
          {filteredBookings.map((booking) => renderBookingCard(booking))}
        </div>
      ) : (
        <p>
          Không có đặt lịch nào cho trạng thái "{statusLabels[selectedStatus]}"
        </p>
      )}

      {/* Nút ở cuối trang để mở modal lịch */}
      <div className="mt-8 text-center">
        <button
          onClick={openCalendarModal}
          className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded"
        >
          Xem Lịch Đặt Lịch
        </button>
      </div>

      {/* Modal lịch đặt */}
      {showCalendarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-lg w-full relative">
            <button
              onClick={closeCalendarModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center">
              Lịch Đặt Lịch
            </h3>
            <Calendar tileClassName={tileClassName} />
            <p className="mt-4 text-center">
              Các ngày được highlight có booking của bạn.
            </p>
          </div>
        </div>
      )}

      {/* Modal chi tiết booking */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-md z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-lg w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4">Chi tiết đặt lịch</h3>
            {selectedBooking && (
              <div className="mb-6">
                <p>
                  <strong>Mã đặt lịch:</strong> {selectedBooking.bookingId}
                </p>
                <p>
                  <strong>Ngày đặt:</strong>{" "}
                  {format(new Date(selectedBooking.bookingDate), "dd/MM/yyyy")}
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{" "}
                  {selectedBooking.totalAmount.toLocaleString()} VNĐ
                </p>
              </div>
            )}
            <div>
              <h4 className="text-xl font-semibold mb-3">
                Chi tiết vaccine & trẻ em:
              </h4>
              {bookingDetails.length > 0 ? (
                bookingDetails.map((detail) => (
                  <div
                    key={detail.bookingDetailId}
                    className="mb-6 p-4 border rounded-lg shadow-sm"
                  >
                    {/* Tên trẻ em nổi bật */}
                    <p className="text-2xl font-extrabold mb-2">
                      {detail.child.firstName} {detail.child.lastName}
                    </p>
                    <p>
                      <strong>Vaccine:</strong> {detail.vaccine.name}
                    </p>
                    {detail.vaccineCombo ? (
                      <p>
                        <strong>Combo:</strong> {detail.vaccineCombo}
                      </p>
                    ) : (
                      <p>
                        <strong>Combo:</strong> Không có
                      </p>
                    )}
                    <p>
                      <strong>Ngày dự kiến tiêm:</strong>{" "}
                      {format(new Date(detail.scheduledDate), "dd/MM/yyyy")}
                    </p>
                    <p>
                      <strong>Ngày tiêm:</strong>{" "}
                      {detail.administeredDate
                        ? format(
                            new Date(detail.administeredDate),
                            "dd/MM/yyyy"
                          )
                        : "Chưa tiêm"}
                    </p>
                    {/* Phản ứng nổi bật */}
                    <p className="mt-4 text-lg font-bold text-red-600">
                      Phản ứng: {detail.reactionNote}
                    </p>
                  </div>
                ))
              ) : (
                <p>Không có chi tiết đặt lịch cho booking này.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCustomer;
