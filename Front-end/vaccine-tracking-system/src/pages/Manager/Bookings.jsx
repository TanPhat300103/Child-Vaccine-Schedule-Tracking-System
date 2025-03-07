// src/pages/Staff/Bookings.jsx
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  getAllBookings,
  cancelBooking,
  confirmBooking,
  getBookingDetailByBooking,
  rescheduleBooking,
} from "../../apis/api";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Các trạng thái tìm kiếm
  const [searchBookingId, setSearchBookingId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Các trạng thái: "daDat" (Đã Đặt), "daHoanThanh" (Đã Hoàn Thành) và "daHuy" (Đã Hủy)
  const [selectedStatus, setSelectedStatus] = useState("daDat");

  // Modal để hiển thị chi tiết booking (cho các trạng thái khác ngoài Đã Đặt)
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Lấy danh sách booking từ backend
  const fetchBookings = async () => {
    try {
      console.log("Gọi API getAllBookings...");
      const data = await getAllBookings();
      console.log("API getAllBookings trả về:", data);
      setBookings(data);
      setFilteredBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Không thể lấy thông tin đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Áp dụng bộ lọc tìm kiếm và trạng thái
  useEffect(() => {
    let filtered = bookings;
    // Lọc theo mã đặt lịch
    if (searchBookingId) {
      filtered = filtered.filter((b) =>
        b.bookingId.toLowerCase().includes(searchBookingId.toLowerCase())
      );
    }
    // Lọc theo khoảng ngày (bookingDate)
    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter((b) => new Date(b.bookingDate) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      filtered = filtered.filter((b) => new Date(b.bookingDate) <= end);
    }
    // Lọc theo khoảng giá (totalAmount)
    if (minPrice) {
      filtered = filtered.filter((b) => b.totalAmount >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((b) => b.totalAmount <= Number(maxPrice));
    }
    // Lọc theo trạng thái đã chọn:
    if (selectedStatus === "daDat") {
      filtered = filtered.filter((b) => b.status === 1);
    } else if (selectedStatus === "daHoanThanh") {
      filtered = filtered.filter((b) => b.status === 2);
    } else if (selectedStatus === "daHuy") {
      filtered = filtered.filter((b) => b.status === 3);
    }
    console.log("Filtered bookings:", filtered);
    setFilteredBookings(filtered);
  }, [
    bookings,
    searchBookingId,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    selectedStatus,
  ]);

  // Xử lý hành động huỷ booking (cho trạng thái Đã Đặt)
  const handleCancelBooking = async (bookingId) => {
    try {
      console.log("Gọi API cancelBooking cho bookingId:", bookingId);
      await cancelBooking(bookingId);
      console.log("Huỷ booking thành công cho bookingId:", bookingId);
      fetchBookings();
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  // Xử lý đặt lại booking (cho trạng thái Đã Hủy)
  const handleRescheduleBooking = async (bookingId) => {
    try {
      console.log("Gọi API rescheduleBooking cho bookingId:", bookingId);
      await rescheduleBooking(bookingId);
      console.log("Đặt lại booking thành công cho bookingId:", bookingId);
      fetchBookings();
    } catch (error) {
      console.error("Error rescheduling booking:", error);
    }
  };

  // Mở modal cho các trạng thái không phải "Đã Đặt"
  const openBookingModal = async (booking) => {
    setSelectedBooking(booking);
    try {
      console.log(
        "Gọi API getBookingDetailByBooking cho bookingId:",
        booking.bookingId
      );
      const details = await getBookingDetailByBooking(booking.bookingId);
      console.log("API getBookingDetailByBooking trả về:", details);
      setBookingDetails(details);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setBookingDetails([]);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    console.log("Đóng modal chi tiết booking");
    setModalVisible(false);
    setSelectedBooking(null);
    setBookingDetails([]);
  };

  // Xác nhận từng booking detail (xác nhận administeredDate)
  const handleConfirmDetail = async (bookingDetailId) => {
    try {
      console.log(
        "Gọi API confirmBooking cho bookingDetailId:",
        bookingDetailId
      );
      await confirmBooking(bookingDetailId);
      console.log(
        "Xác nhận booking detail thành công cho bookingDetailId:",
        bookingDetailId
      );
      const details = await getBookingDetailByBooking(
        selectedBooking.bookingId
      );
      console.log("Làm mới booking details:", details);
      setBookingDetails(details);
    } catch (error) {
      console.error("Error confirming booking detail:", error);
    }
  };

  // Xử lý sự kiện click vào thẻ booking
  const handleBookingClick = (booking) => {
    // Nếu booking ở trạng thái "Đã Đặt" (status === 1) thì điều hướng sang trang BookingDetail.jsx
    if (booking.status === 1) {
      navigate(`/booking-detail/${booking.bookingId}`);
    } else {
      // Các trạng thái khác thì mở modal để xem chi tiết (hoặc xử lý khác nếu cần)
      openBookingModal(booking);
    }
  };

  // Render từng thẻ booking với các hành động tương ứng theo trạng thái
  const renderBookingCard = (booking) => (
    <div
      key={booking.bookingId}
      className="p-4 border rounded-md shadow-sm cursor-pointer min-w-[250px] flex-shrink-0 hover:shadow-lg hover:scale-105 transition-transform duration-300"
      onClick={() => handleBookingClick(booking)}
    >
      <p className="font-bold">Mã đặt lịch: {booking.bookingId}</p>
      {booking.customer && (
        <p className="text-lg text-indigo-600 font-bold">
          Customer: {booking.customer.firstName} {booking.customer.lastName}
        </p>
      )}
      <p>Ngày đặt: {format(new Date(booking.bookingDate), "dd/MM/yyyy")}</p>
      <p>Tổng tiền: {booking.totalAmount.toLocaleString()} VNĐ</p>
      <div className="mt-4">
        {booking.status === 3 && (
          <p className="text-red-600 font-bold">Đã Hủy</p>
        )}
        {booking.status === 2 && (
          <p className="text-green-600 font-bold">Đã Hoàn Thành</p>
        )}
        {booking.status === 1 && (
          <p className="text-blue-600 font-bold">Đã Đặt</p>
        )}
      </div>
      <div className="mt-4">
        {booking.status === 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancelBooking(booking.bookingId);
            }}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Hủy
          </button>
        )}
        {booking.status === 3 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRescheduleBooking(booking.bookingId);
            }}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Đặt Lại
          </button>
        )}
      </div>
    </div>
  );

  // Cập nhật bộ lọc trạng thái với 3 lựa chọn
  const statusFilters = [
    { key: "daDat", label: "Đã Đặt", style: "bg-blue-500 hover:bg-blue-600" },
    {
      key: "daHoanThanh",
      label: "Đã Hoàn Thành",
      style: "bg-green-500 hover:bg-green-600",
    },
    { key: "daHuy", label: "Đã Hủy", style: "bg-red-500 hover:bg-red-600" },
  ];

  if (loading) return <p>Đang tải thông tin đặt lịch...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Quản Lý Đặt Lịch</h2>

      {/* Thanh tìm kiếm */}
      <div className="mb-6 p-4 border rounded-md">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <input
            type="text"
            placeholder="Tìm theo mã đặt lịch"
            value={searchBookingId}
            onChange={(e) => setSearchBookingId(e.target.value)}
            className="px-3 py-2 border rounded-md w-full md:w-1/3"
          />
          <input
            type="date"
            placeholder="Từ ngày"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border rounded-md w-full md:w-1/4"
          />
          <input
            type="date"
            placeholder="Đến ngày"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border rounded-md w-full md:w-1/4"
          />
          <input
            type="number"
            placeholder="Giá tối thiểu"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-3 py-2 border rounded-md w-full md:w-1/5"
          />
          <input
            type="number"
            placeholder="Giá tối đa"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-3 py-2 border rounded-md w-full md:w-1/5"
          />
        </div>
      </div>

      {/* Các nút filter trạng thái */}
      <div className="flex space-x-4 mb-6">
        {statusFilters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => {
              console.log("Đã chọn filter:", filter.key);
              setSelectedStatus(filter.key);
            }}
            className={`px-4 py-2 rounded text-white ${filter.style} ${
              selectedStatus === filter.key
                ? "ring-4 ring-offset-2 ring-gray-300"
                : ""
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Danh sách booking */}
      {filteredBookings.length > 0 ? (
        <div className="flex space-x-4 overflow-x-auto">
          {filteredBookings.map((booking) => renderBookingCard(booking))}
        </div>
      ) : (
        <p>Không có đặt lịch nào phù hợp với tiêu chí tìm kiếm</p>
      )}

      {/* Modal chi tiết booking cho các trạng thái khác "Đã Đặt" */}
      {modalVisible && selectedBooking && (
        <div
          className="fixed inset-0 bg-opacity-60 flex items-center justify-center backdrop-blur-md z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-8 shadow-2xl max-w-2xl w-full relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4">
              Chi tiết đặt lịch: {selectedBooking.bookingId}
            </h3>
            <p className="mb-2">
              Ngày đặt:{" "}
              {format(new Date(selectedBooking.bookingDate), "dd/MM/yyyy")}
            </p>
            <p className="mb-4">
              Tổng tiền: {selectedBooking.totalAmount.toLocaleString()} VNĐ
            </p>
            <div>
              <h4 className="text-xl font-semibold mb-3">
                Chi tiết vaccine & trẻ em:
              </h4>
              {bookingDetails.length > 0 ? (
                <>
                  {(isExpanded
                    ? bookingDetails
                    : bookingDetails.slice(0, 3)
                  ).map((detail) => (
                    <div
                      key={detail.bookingDetailId}
                      className="mb-6 p-4 border rounded-lg shadow-sm"
                    >
                      <p className="text-2xl font-extrabold mb-2">
                        {detail.child.firstName} {detail.child.lastName}
                      </p>
                      <p>
                        <strong>Vaccine:</strong> {detail.vaccine.name}
                      </p>
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
                      {detail.feedback && (
                        <p className="mt-2 text-sm italic">
                          Feedback: {detail.feedback}
                        </p>
                      )}
                      {selectedStatus === "daHoanThanh" &&
                        !detail.administeredDate && (
                          <button
                            onClick={() =>
                              handleConfirmDetail(detail.bookingDetailId)
                            }
                            className="mt-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                          >
                            Xác nhận
                          </button>
                        )}
                    </div>
                  ))}
                  {!isExpanded && bookingDetails.length > 3 && (
                    <div className="text-center">
                      <button
                        onClick={() => setIsExpanded(true)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                      >
                        Xem thêm
                      </button>
                    </div>
                  )}
                </>
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

export default Bookings;
