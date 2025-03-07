// src/pages/Staff/Bookings.jsx
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { getAllBookings } from "../../apis/api";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Các state tìm kiếm khách hàng (bên trái)
  const [customerIdSearch, setCustomerIdSearch] = useState("");
  const [customerNameSearch, setCustomerNameSearch] = useState("");
  const [customerPhoneSearch, setCustomerPhoneSearch] = useState("");
  const [customerEmailSearch, setCustomerEmailSearch] = useState("");

  // Các state tìm kiếm booking (bên phải)
  const [bookingIdSearch, setBookingIdSearch] = useState("");
  const [bookingDateSearch, setBookingDateSearch] = useState("");
  const [childNameSearch, setChildNameSearch] = useState("");
  const [scheduledDateSearch, setScheduledDateSearch] = useState("");
  const [vaccineSearch, setVaccineSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all"); // all, daDat, daHoanThanh, daHuy

  // Khách hàng được chọn
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Lấy danh sách booking từ API
  const fetchBookings = async () => {
    try {
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      setError("Không thể lấy thông tin đặt lịch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Tạo danh sách khách hàng duy nhất từ bookings
  const customers = Array.from(
    new Map(bookings.map((b) => [b.customer.customerId, b.customer])).values()
  );

  // Lọc khách hàng theo các ô tìm kiếm riêng
  const filteredCustomers = customers.filter((cust) => {
    const matchId = cust.customerId
      .toLowerCase()
      .includes(customerIdSearch.toLowerCase());
    const fullName = (cust.firstName + " " + cust.lastName).toLowerCase();
    const matchName = fullName.includes(customerNameSearch.toLowerCase());
    const matchPhone = cust.phoneNumber
      .toLowerCase()
      .includes(customerPhoneSearch.toLowerCase());
    const matchEmail = cust.email
      ?.toLowerCase()
      .includes(customerEmailSearch.toLowerCase());
    return matchId && matchName && matchPhone && matchEmail;
  });

  // Lọc danh sách booking của khách hàng được chọn
  let customerBookings = [];
  if (selectedCustomer) {
    customerBookings = bookings.filter(
      (b) => b.customer.customerId === selectedCustomer.customerId
    );
  }

  // Lọc booking theo các ô tìm kiếm bên phải
  const filteredBookings = customerBookings.filter((b) => {
    let match = true;
    if (bookingIdSearch) {
      match =
        match &&
        b.bookingId.toLowerCase().includes(bookingIdSearch.toLowerCase());
    }
    if (bookingDateSearch) {
      const dateStr = format(new Date(b.bookingDate), "yyyy-MM-dd");
      match = match && dateStr === bookingDateSearch;
    }
    // Các trường "childName", "scheduledDate", "vaccine" thường có ở chi tiết đặt lịch
    // Nếu cần lọc theo các thông tin này, cần có dữ liệu bookingDetails. Ví dụ ở đây sẽ chỉ để hiển thị nếu có
    // (Để demo, ta có thể bỏ qua hoặc xử lý tùy thuộc vào cấu trúc dữ liệu thực tế.)
    if (selectedStatus !== "all") {
      const statusMap = {
        daDat: 1,
        daHoanThanh: 2,
        daHuy: 3,
      };
      match = match && b.status === statusMap[selectedStatus];
    }
    return match;
  });

  // Khi click vào 1 khách hàng (thẻ ngang)
  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  // Khi click vào 1 booking (thẻ ngang) -> điều hướng đến BookingDetail
  const handleBookingClick = (booking) => {
    navigate(`../booking-detail/${booking.bookingId}`);
  };

  if (loading) return <p>Đang tải thông tin đặt lịch...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 flex gap-4">
      {/* Bên trái: Danh sách khách hàng */}
      <div className="w-1/3 border p-4 rounded">
        <h2 className="text-2xl font-bold mb-4">Danh sách khách hàng</h2>
        <div className="mb-4 space-y-2">
          <input
            type="text"
            placeholder="Mã khách hàng"
            value={customerIdSearch}
            onChange={(e) => setCustomerIdSearch(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Tên khách hàng"
            value={customerNameSearch}
            onChange={(e) => setCustomerNameSearch(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="SĐT"
            value={customerPhoneSearch}
            onChange={(e) => setCustomerPhoneSearch(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Email"
            value={customerEmailSearch}
            onChange={(e) => setCustomerEmailSearch(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="space-y-2">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((cust) => (
              <div
                key={cust.customerId}
                onClick={() => handleCustomerClick(cust)}
                className={`p-4 border rounded cursor-pointer flex flex-row items-center justify-between ${
                  selectedCustomer &&
                  selectedCustomer.customerId === cust.customerId
                    ? "bg-blue-200"
                    : "bg-white"
                }`}
              >
                <div>
                  <p className="font-bold">Mã: {cust.customerId}</p>
                  <p>
                    Tên: {cust.firstName} {cust.lastName}
                  </p>
                </div>
                <div className="text-sm">
                  <p>SĐT: {cust.phoneNumber}</p>
                  <p>Email: {cust.email}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Không có khách hàng phù hợp</p>
          )}
        </div>
      </div>

      {/* Bên phải: Danh sách booking của khách hàng được chọn */}
      <div className="w-2/3 border p-4 rounded">
        {selectedCustomer ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Booking của khách hàng: {selectedCustomer.firstName}{" "}
              {selectedCustomer.lastName}
            </h2>
            {/* Thanh tìm kiếm booking */}
            <div className="mb-4 space-y-2">
              <input
                type="text"
                placeholder="Mã booking"
                value={bookingIdSearch}
                onChange={(e) => setBookingIdSearch(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                placeholder="Ngày đặt"
                value={bookingDateSearch}
                onChange={(e) => setBookingDateSearch(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Tên đứa trẻ"
                value={childNameSearch}
                onChange={(e) => setChildNameSearch(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                placeholder="Ngày dự kiến tiêm"
                value={scheduledDateSearch}
                onChange={(e) => setScheduledDateSearch(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Vaccine"
                value={vaccineSearch}
                onChange={(e) => setVaccineSearch(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            {/* Nút lọc trạng thái */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSelectedStatus("all")}
                className={`px-4 py-2 rounded ${
                  selectedStatus === "all"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-300"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setSelectedStatus("daDat")}
                className={`px-4 py-2 rounded ${
                  selectedStatus === "daDat"
                    ? "bg-blue-700 text-white"
                    : "bg-blue-300"
                }`}
              >
                Đã Đặt
              </button>
              <button
                onClick={() => setSelectedStatus("daHoanThanh")}
                className={`px-4 py-2 rounded ${
                  selectedStatus === "daHoanThanh"
                    ? "bg-green-700 text-white"
                    : "bg-green-300"
                }`}
              >
                Đã Hoàn Thành
              </button>
              <button
                onClick={() => setSelectedStatus("daHuy")}
                className={`px-4 py-2 rounded ${
                  selectedStatus === "daHuy"
                    ? "bg-red-700 text-white"
                    : "bg-red-300"
                }`}
              >
                Đã Hủy
              </button>
            </div>
            <div className="space-y-2">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    onClick={() => handleBookingClick(booking)}
                    className="p-4 border rounded cursor-pointer flex flex-row items-center justify-between hover:shadow-lg transition-transform duration-300"
                  >
                    <p className="font-bold">Mã: {booking.bookingId}</p>
                    <p>
                      Ngày đặt:{" "}
                      {format(new Date(booking.bookingDate), "dd/MM/yyyy")}
                    </p>
                    <p>Tổng: {booking.totalAmount.toLocaleString()} VNĐ</p>
                  </div>
                ))
              ) : (
                <p>Không có booking nào phù hợp</p>
              )}
            </div>
          </>
        ) : (
          <p>Vui lòng chọn khách hàng bên trái để xem danh sách booking.</p>
        )}
      </div>
    </div>
  );
};

export default Bookings;
