import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
import { useAuth } from "../../components/common/AuthContext";
import { FaSyringe, FaCalendarAlt, FaTimes, FaChild, FaMoneyCheckAlt } from "react-icons/fa"; // Thêm icon từ react-icons

const BookingCustomer = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const customerId = userInfo?.userId || "C001";
        const data = await getBookingByCustomerId(customerId);
        setBookings(data);
      } catch (err) {
        setError("Không thể lấy thông tin đặt lịch");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [userInfo]);

  const handleStatusClick = (status) => setSelectedStatus(status);

  const handleCardClick = async (booking) => {
    setSelectedBooking(booking);
    try {
      const details = await getBookingDetailByBooking(booking.bookingId);
      setBookingDetails(details);
    } catch (err) {
      setBookingDetails([]);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setBookingDetails([]);
    setSelectedBooking(null);
  };

  const handleCancelBooking = async (bookingId, e) => {
    e.stopPropagation();
    await cancelBooking(bookingId);
    fetchBookings();
  };

  const handlePaymentClick = (booking) => {
    const bookingData = {
      bookingId: booking.bookingId,
      bookingDate: booking.bookingDate,
      totalAmount: booking.totalAmount,
    };
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
  };

  const handleRescheduleBooking = async (bookingId, e) => {
    e.stopPropagation();
    await rescheduleBooking(bookingId);
    fetchBookings();
  };


  const statusLabels = { 0: "Đã Đặt", 2: "Đã Hoàn Thành", 3: "Đã Huỷ" };


  const renderBookingCard = (booking) => (
    <div
      key={booking.bookingId}
      className="p-5 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden"
      onClick={() => handleCardClick(booking)}
    >
      {/* Nền gradient nhẹ */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-50"></div>
      
      {/* Icon trạng thái */}
      <div className="absolute top-4 left-4">
        <FaSyringe
          className={`text-2xl ${
            booking.status === 0 ? "text-blue-500" : booking.status === 2 ? "text-green-500" : "text-red-500"
          } animate-pulse`}
        />
      </div>

      <div className="relative z-10 pl-10 space-y-2">
        <p className="font-semibold text-blue-600 text-lg">
          Mã đặt lịch: {booking.bookingId}
        </p>
        <p className="text-gray-700 flex items-center">
          <FaCalendarAlt className="mr-2 text-blue-400" />
          Ngày đặt: {format(new Date(booking.bookingDate), "dd/MM/yyyy")}
        </p>
        <p className="text-gray-700 flex items-center">
          <FaMoneyCheckAlt className="mr-2 text-green-400" />
          Tổng tiền: {booking.totalAmount.toLocaleString()} VNĐ
        </p>
      </div>

      {/* Nút hành động */}
      <div className="mt-4 flex space-x-3 z-10 relative">
        {booking.status === 0 && (
          <>
            <NavLink
              to="/paymentVnpay2"
              onClick={(e) => {
                e.stopPropagation();
                handlePaymentClick(booking);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center"
            >
              <FaMoneyCheckAlt className="mr-2" /> Thanh Toán
            </NavLink>
            <button
              onClick={(e) => handleCancelBooking(booking.bookingId, e)}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200"
            >
              Huỷ
            </button>
          </>
        )}
        {booking.status === 2 && (
          <NavLink

            to="/paymentVnpay2"
            state={{
              bookingId: booking.bookingId,
              bookingDate: booking.bookingDate,
              totalAmount: booking.totalAmount.toLocaleString(),
            }}
            onClick={() => handlePaymentClick(booking)}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"

          >
            Feedback
          </NavLink>
        )}
        {booking.status === 3 && (
          <button
            onClick={(e) => handleRescheduleBooking(booking.bookingId, e)}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200"
          >
            Đặt Lại
          </button>
        )}
      </div>
    </div>
  );

  const bookingDates = bookings.map((b) => new Date(b.bookingDate));
  const tileClassName = ({ date, view }) =>
    view === "month" && bookingDates.some((d) => isSameDay(d, date))
      ? "bg-blue-100 text-blue-700 rounded-full font-semibold"
      : null;

  if (loading) return <p className="text-gray-600 text-center">Đang tải...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (


    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Tiêu đề */}
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Quản Lý Lịch Tiêm Chủng
        </h1>

        {/* Bộ lọc trạng thái */}
        <div className="flex justify-center space-x-4 mb-8">
          {[0, 2, 3].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusClick(status)}
              className={`px-6 py-3 rounded-full font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 ${
                status === 0
                  ? "bg-blue-500 hover:bg-blue-600"
                  : status === 2
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } ${selectedStatus === status ? "ring-4 ring-opacity-50 ring-offset-2 ring-blue-300" : ""}`}
            >
              {statusLabels[status]}
            </button>
          ))}
        </div>

        {/* Danh sách booking */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings
            .filter((b) => b.status === selectedStatus)
            .map((booking) => renderBookingCard(booking))}
        </div>

        {/* Nút mở lịch */}
        <div className="mt-10 text-center">

          <button
            onClick={() => setShowCalendarModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 flex items-center mx-auto"
          >
            <FaCalendarAlt className="mr-2" /> Xem Lịch Đặt Lịch
          </button>
        </div>

        {/* Modal lịch */}
        {showCalendarModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-2xl p-8 shadow-xl max-w-lg w-full animate-fadeIn">
              <button
                onClick={() => setShowCalendarModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              >
                <FaTimes />
              </button>
              <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                Lịch Đặt Tiêm Chủng
              </h3>
              <Calendar tileClassName={tileClassName} className="border-none" />
            </div>
          </div>
        )}

        {/* Modal chi tiết */}
        {modalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-2xl p-8 shadow-xl max-w-lg w-full animate-fadeIn">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              >
                <FaTimes />
              </button>
              <h3 className="text-2xl font-bold text-blue-700 mb-6">Chi Tiết Đặt Lịch</h3>
              {selectedBooking && (
                <div className="space-y-4">
                  <p className="text-gray-800">
                    <strong className="text-blue-600">Mã đặt lịch:</strong> {selectedBooking.bookingId}
                  </p>
                  <p className="text-gray-800">
                    <strong className="text-blue-600">Ngày đặt:</strong>{" "}
                    {format(new Date(selectedBooking.bookingDate), "dd/MM/yyyy")}
                  </p>
                  <p className="text-gray-800">
                    <strong className="text-blue-600">Tổng tiền:</strong>{" "}
                    {selectedBooking.totalAmount.toLocaleString()} VNĐ
                  </p>
                  <h4 className="text-lg font-semibold text-blue-600 mt-6 flex items-center">
                    <FaChild className="mr-2" /> Vaccine & Trẻ Em
                  </h4>
                  {bookingDetails.map((detail) => (
                    <div
                      key={detail.bookingDetailId}
                      className="p-4 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <p className="text-lg font-semibold text-blue-700">
                        {detail.child.firstName} {detail.child.lastName}
                      </p>
                      <p className="text-gray-700">
                        <strong className="text-blue-600">Vaccine:</strong> {detail.vaccine.name}
                      </p>
                      <p className="text-gray-700">
                        <strong className="text-blue-600">Combo:</strong>{" "}
                        {detail.vaccineCombo || "Không có"}
                      </p>
                      <p className="text-gray-700">
                        <strong className="text-blue-600">Ngày dự kiến:</strong>{" "}
                        {format(new Date(detail.scheduledDate), "dd/MM/yyyy")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCustomer; 