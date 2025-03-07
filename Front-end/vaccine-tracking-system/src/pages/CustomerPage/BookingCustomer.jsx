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
import {
  FaSyringe,
  FaCalendarAlt,
  FaTimes,
  FaChild,
  FaMoneyCheckAlt,
  FaUser,
  FaRegCheckCircle,
  FaRegClock,
  FaRegTimesCircle,
  FaRegCalendarAlt,
  FaArrowRight,
  FaInfoCircle,
  FaUserAlt,
  FaClock,
  FaClipboardList,
  FaPlusCircle,
  FaFilter,
} from "react-icons/fa";

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

  // Hàm helper: Tính trạng thái hiển thị dựa trên booking.status và bookingDetails
  const recategorizedStatus = (booking) => {
    if (booking.status === 2) {
      if (booking.bookingDetails && booking.bookingDetails.length > 0) {
        const fullyAdministered = booking.bookingDetails.every(
          (detail) => detail.administeredDate !== null
        );
        return fullyAdministered ? 2 : 0;
      }
      // Nếu chưa có bookingDetails hoặc mảng rỗng, xem như chưa hoàn thành
      return 0;
    }
    return booking.status;
  };

  // Cập nhật API: Với mỗi booking có status === 2, fetch booking details ngay khi load trang
  const fetchBookings = async () => {
    try {
      const customerId = userInfo?.userId || "C001";
      const data = await getBookingByCustomerId(customerId);
      // Với mỗi booking có status = 2, fetch booking details và gán vào booking.bookingDetails
      const updatedData = await Promise.all(
        data.map(async (booking) => {
          if (booking.status === 2) {
            try {
              const details = await getBookingDetailByBooking(
                booking.bookingId
              );
              return { ...booking, bookingDetails: details };
            } catch (err) {
              return { ...booking, bookingDetails: [] };
            }
          }
          return booking;
        })
      );
      setBookings(updatedData);
    } catch (err) {
      setError("Không thể lấy thông tin đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userInfo]);

  const handleStatusClick = (status) => setSelectedStatus(status);

  // Khi người dùng nhấn vào thẻ booking, nếu cần cập nhật chi tiết thì vẫn có thể fetch lại
  const handleCardClick = async (booking) => {
    setSelectedBooking(booking);
    try {
      // Nếu booking đã có bookingDetails thì không cần fetch lại
      if (!booking.bookingDetails) {
        const details = await getBookingDetailByBooking(booking.bookingId);
        setBookingDetails(details);
        // Cập nhật booking object để sử dụng cho modal
        booking.bookingDetails = details;
      } else {
        setBookingDetails(booking.bookingDetails);
      }
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
  const statusIcons = {
    0: <FaRegClock className="mr-2" />,
    2: <FaRegCheckCircle className="mr-2" />,
    3: <FaRegTimesCircle className="mr-2" />,
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return (
          <span className="absolute top-4 right-4 px-3 py-1 bg-blue-100 text-blue-700 font-medium rounded-full text-xs flex items-center">
            <FaRegClock className="mr-1" /> Chờ xử lý
          </span>
        );
      case 2:
        return (
          <span className="absolute top-4 right-4 px-3 py-1 bg-green-100 text-green-700 font-medium rounded-full text-xs flex items-center">
            <FaRegCheckCircle className="mr-1" /> Hoàn thành
          </span>
        );
      case 3:
        return (
          <span className="absolute top-4 right-4 px-3 py-1 bg-red-100 text-red-700 font-medium rounded-full text-xs flex items-center">
            <FaRegTimesCircle className="mr-1" /> Đã huỷ
          </span>
        );
      default:
        return null;
    }
  };

  const renderBookingCard = (booking) => {
    // Dùng recategorizedStatus để xác định trạng thái hiển thị
    const displayStatus = recategorizedStatus(booking);

    return (
      <div
        key={booking.bookingId}
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group border border-gray-100"
        onClick={() => handleCardClick(booking)}
      >
        {/* Status badge */}
        {getStatusBadge(displayStatus)}

        {/* Card content */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div
              className={`p-3 rounded-full mr-4 ${
                displayStatus === 0
                  ? "bg-blue-100"
                  : displayStatus === 2
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              <FaSyringe
                className={`text-xl ${
                  displayStatus === 0
                    ? "text-blue-600"
                    : displayStatus === 2
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Mã đặt lịch</h3>
              <p className="text-lg font-bold text-blue-600">
                {booking.bookingId}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex items-center">
              <FaRegCalendarAlt className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Ngày đặt</p>
                <p className="font-medium text-gray-800">
                  {format(new Date(booking.bookingDate), "dd/MM/yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <FaMoneyCheckAlt className="text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Tổng tiền</p>
                <p className="font-medium text-gray-800">
                  {booking.totalAmount.toLocaleString()} VNĐ
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-gray-100">
            {booking.status === 0 && (
              <div className="flex space-x-3">
                <NavLink
                  to="/paymentVnpay2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePaymentClick(booking);
                  }}
                  className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg flex justify-center items-center font-medium transition-all hover:from-blue-600 hover:to-blue-700"
                >
                  <FaMoneyCheckAlt className="mr-2" /> Thanh Toán
                </NavLink>
                <button
                  onClick={(e) => handleCancelBooking(booking.bookingId, e)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex justify-center items-center"
                >
                  <FaRegTimesCircle className="mr-2" /> Huỷ
                </button>
              </div>
            )}

            {booking.status === 2 &&
              booking.bookingDetails &&
              booking.bookingDetails.every(
                (detail) => detail.administeredDate !== null
              ) && (
                <NavLink
                  to="/paymentVnpay2"
                  state={{
                    bookingId: booking.bookingId,
                    bookingDate: booking.bookingDate,
                    totalAmount: booking.totalAmount.toLocaleString(),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePaymentClick(booking);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg flex justify-center items-center font-medium transition-all hover:from-indigo-600 hover:to-indigo-700"
                >
                  <FaClipboardList className="mr-2" /> Đánh giá dịch vụ
                </NavLink>
              )}

            {booking.status === 2 &&
              (!booking.bookingDetails ||
                !booking.bookingDetails.every(
                  (detail) => detail.administeredDate !== null
                )) && (
                <div className="w-full py-2 bg-yellow-100 text-yellow-700 rounded-lg flex justify-center items-center font-medium">
                  <FaClock className="mr-2" /> Chờ Ngày Tiêm
                </div>
              )}

            {booking.status === 3 && (
              <button
                onClick={(e) => handleRescheduleBooking(booking.bookingId, e)}
                className="w-full py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg flex justify-center items-center font-medium transition-all hover:from-green-600 hover:to-green-700"
              >
                <FaPlusCircle className="mr-2" /> Đặt Lại
              </button>
            )}
          </div>

          {/* View details button */}
          <div className="mt-3 text-center">
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-all flex items-center justify-center mx-auto">
              Xem chi tiết <FaArrowRight className="ml-1 text-xs" />
            </button>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    );
  };

  // Lọc danh sách booking theo trạng thái recategorized:
  const filteredBookings = bookings.filter(
    (b) => recategorizedStatus(b) === selectedStatus
  );

  const bookingDates = bookings.map((b) => new Date(b.bookingDate));
  const tileClassName = ({ date, view }) =>
    view === "month" && bookingDates.some((d) => isSameDay(d, date))
      ? "bg-blue-100 text-blue-700 rounded-full font-semibold"
      : null;

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg max-w-md">
          <div className="flex items-center mb-2">
            <FaTimes className="mr-2" />
            <h3 className="font-medium">Đã xảy ra lỗi</h3>
          </div>
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-3 flex items-center">
            <FaSyringe className="mr-3" /> Quản Lý Lịch Tiêm Chủng
          </h1>
          <p className="text-blue-100 max-w-2xl">
            Theo dõi, quản lý và cập nhật các lịch tiêm chủng của gia đình bạn.
            Tại đây bạn có thể thanh toán, huỷ lịch hoặc đặt lại lịch tiêm.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-6">
        {/* Thẻ thông tin */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <FaUserAlt className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Xin chào</h3>
                <p className="text-xl font-bold text-gray-800">
                  {userInfo?.fullName || "Người dùng"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCalendarModal(true)}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-300 flex items-center"
            >
              <FaCalendarAlt className="mr-2" /> Xem Lịch Đặt Lịch
            </button>
          </div>
        </div>

        {/* Bộ lọc trạng thái */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaFilter className="mr-2 text-blue-600" /> Lọc theo trạng thái
          </h2>

          <div className="flex flex-wrap gap-3">
            {Object.entries(statusLabels).map(([status, label]) => (
              <button
                key={status}
                onClick={() => handleStatusClick(parseInt(status))}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center ${
                  selectedStatus === parseInt(status)
                    ? status === "0"
                      ? "bg-blue-600 text-white"
                      : status === "2"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {statusIcons[status]} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách booking */}
        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredBookings.map((booking) => renderBookingCard(booking))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center mb-12 border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-blue-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Không có lịch tiêm nào
            </h3>
            <p className="text-gray-600 mb-4">
              Hiện tại bạn không có lịch tiêm nào ở trạng thái này
            </p>
            <NavLink
              to="/booking"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 inline-flex items-center"
            >
              <FaPlusCircle className="mr-2" /> Đặt lịch mới
            </NavLink>
          </div>
        )}
      </div>

      {/* Modal lịch */}
      {showCalendarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-lg w-full animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-600" /> Lịch Tiêm Chủng
              </h3>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-all"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg text-blue-700 text-sm">
              <div className="flex items-start">
                <FaInfoCircle className="mr-2 mt-1 flex-shrink-0" />
                <p>
                  Các ngày có lịch tiêm được đánh dấu màu xanh trong lịch dưới
                  đây
                </p>
              </div>
            </div>

            <Calendar
              tileClassName={tileClassName}
              className="border-none shadow-none"
            />

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowCalendarModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-2xl w-full animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-600" /> Chi Tiết Đặt
                Lịch
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-all"
              >
                <FaTimes />
              </button>
            </div>

            {selectedBooking && (
              <div>
                {/* Thông tin booking */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-blue-700 font-medium">
                        Mã đặt lịch
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {selectedBooking.bookingId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">
                        Ngày đặt
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {format(
                          new Date(selectedBooking.bookingDate),
                          "dd/MM/yyyy"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">
                        Tổng tiền
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {selectedBooking.totalAmount.toLocaleString()} VNĐ
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thông tin vaccine & trẻ em */}
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaChild className="mr-2 text-blue-600" /> Thông tin vaccine &
                  trẻ em
                </h4>

                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {bookingDetails.length > 0 ? (
                    bookingDetails.map((detail) => (
                      <div
                        key={detail.bookingDetailId}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all"
                      >
                        <div className="flex items-center mb-3">
                          <div className="p-2 bg-blue-100 rounded-full mr-3">
                            <FaChild className="text-blue-600" />
                          </div>
                          <h5 className="text-lg font-semibold text-gray-800">
                            {detail.child.firstName} {detail.child.lastName}
                          </h5>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-gray-500">Vaccine</p>
                            <p className="font-medium text-gray-800">
                              {detail.vaccine.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Combo</p>
                            <p className="font-medium text-gray-800">
                              {detail.vaccineCombo || "Không có"}
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <p className="text-sm text-gray-500">
                              Ngày dự kiến tiêm
                            </p>
                            <p className="font-medium text-gray-800 flex items-center">
                              <FaRegCalendarAlt className="mr-2 text-blue-500" />
                              {format(
                                new Date(detail.scheduledDate),
                                "dd/MM/yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 text-gray-500">
                      Không có thông tin chi tiết
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCustomer;
