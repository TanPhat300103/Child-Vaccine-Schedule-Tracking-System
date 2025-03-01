// src/pages/Staff/Bookings.jsx
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { getAllBookings, cancelBooking, confirmBooking } from "../../apis/api"; // đảm bảo các API này đã được định nghĩa

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search filter states
  const [searchBookingId, setSearchBookingId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Status filter: "dangXuLy", "daThanhToan", "daXacNhan", "daHuy"
  const [selectedStatus, setSelectedStatus] = useState("dangXuLy");

  // Fetch all bookings từ backend
  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
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
    // Lọc theo trạng thái được chọn:
    filtered = filtered.filter((b) => {
      if (selectedStatus === "dangXuLy") {
        return b.status === 1;
      } else if (selectedStatus === "daHuy") {
        return b.status === 3;
      } else if (selectedStatus === "daThanhToan") {
        // booking.status === 2 và administeredDate chưa có
        return b.status === 2 && !b.administeredDate;
      } else if (selectedStatus === "daXacNhan") {
        // booking.status === 2 và administeredDate đã có
        return b.status === 2 && b.administeredDate;
      }
      return true;
    });
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

  // Xử lý hành động
  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      fetchBookings();
    } catch (error) {
      console.error("Error canceling booking:", error);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await confirmBooking(bookingId);
      fetchBookings();
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  // Render card cho từng booking
  const renderBookingCard = (booking) => (
    <div
      key={booking.bookingId}
      className="p-4 border rounded-md shadow-sm cursor-pointer min-w-[250px] flex-shrink-0 hover:shadow-lg hover:scale-105 transition-transform duration-300"
    >
      <p className="font-bold">Mã đặt lịch: {booking.bookingId}</p>
      <p>Ngày đặt: {format(new Date(booking.bookingDate), "dd/MM/yyyy")}</p>
      <p>Tổng tiền: {booking.totalAmount.toLocaleString()} VNĐ</p>
      {/* Nếu có Feedback, hiển thị nó */}
      {booking.feedback && (
        <p className="mt-2 text-sm italic">Feedback: {booking.feedback}</p>
      )}
      <div className="mt-4">
        {selectedStatus === "dangXuLy" && (
          <button
            onClick={() => handleCancelBooking(booking.bookingId)}
            className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Hủy Đặt Lịch
          </button>
        )}
        {selectedStatus === "daThanhToan" && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleConfirmBooking(booking.bookingId)}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Xác Nhận
            </button>
            <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded">
              Feedback
            </button>
          </div>
        )}
        {selectedStatus === "daXacNhan" && (
          <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded">
            Feedback
          </button>
        )}
        {/* Ở trạng thái "Đã Hủy" có thể không có hành động */}
      </div>
    </div>
  );

  // Các nút filter trạng thái
  const statusFilters = [
    {
      key: "dangXuLy",
      label: "Đang Xử Lý",
      style: "bg-blue-500 hover:bg-blue-600",
    },
    {
      key: "daThanhToan",
      label: "Đã Thanh Toán",
      style: "bg-green-500 hover:bg-green-600",
    },
    {
      key: "daXacNhan",
      label: "Đã Xác Nhận",
      style: "bg-yellow-500 hover:bg-yellow-600",
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
            onClick={() => setSelectedStatus(filter.key)}
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
    </div>
  );
};

export default Bookings;
