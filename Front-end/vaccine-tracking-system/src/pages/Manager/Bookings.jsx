import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllBookings } from "../../apis/api";
import {
  CalendarIcon,
  UserIcon,
  DollarSignIcon,
  PhoneIcon,
  MailIcon,
  CheckCircleIcon,
  ClockIcon,
  AlertCircleIcon,
  MapPinIcon,
  ShieldIcon,
} from "lucide-react";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Customer search (left side)
  const [customerSearchType, setCustomerSearchType] = useState("customerId");
  const [customerSearchValue, setCustomerSearchValue] = useState("");

  // Booking search (right side)
  const [bookingSearchType, setBookingSearchType] = useState("bookingId");
  const [bookingSearchValue, setBookingSearchValue] = useState("");

  // Status filter
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Selected customer
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const location = useLocation();
  useEffect(() => {
    if (location.state) {
      if (location.state.selectedCustomer) {
        setSelectedCustomer(location.state.selectedCustomer);
      }
      if (location.state.customerSearchValue) {
        setCustomerSearchValue(location.state.customerSearchValue);
      }
      if (location.state.bookingSearchValue) {
        setBookingSearchValue(location.state.bookingSearchValue);
      }
      if (location.state.selectedStatus) {
        setSelectedStatus(location.state.selectedStatus);
      }
    }
    console.log("magic: ", location.state);
  }, [location.state]);
  // Fetch bookings from API
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

  // Create unique customer list from bookings
  const customers = Array.from(
    new Map(bookings.map((b) => [b.customer.customerId, b.customer])).values()
  );

  // Filter customers based on search criteria
  const filteredCustomers = customers.filter((cust) => {
    if (!customerSearchValue) return true;

    switch (customerSearchType) {
      case "customerId":
        return cust.customerId
          .toLowerCase()
          .includes(customerSearchValue.toLowerCase());
      case "customerName":
        const fullName = (cust.firstName + " " + cust.lastName).toLowerCase();
        return fullName.includes(customerSearchValue.toLowerCase());
      case "phone":
        return cust.phoneNumber
          .toLowerCase()
          .includes(customerSearchValue.toLowerCase());
      case "email":
        return cust.email
          ?.toLowerCase()
          .includes(customerSearchValue.toLowerCase());
      default:
        return true;
    }
  });

  // Filter bookings for selected customer
  let customerBookings = [];
  if (selectedCustomer) {
    customerBookings = bookings.filter(
      (b) => b.customer.customerId === selectedCustomer.customerId
    );

    // Filter bookings by search criteria
    if (bookingSearchValue) {
      customerBookings = customerBookings.filter((b) => {
        switch (bookingSearchType) {
          case "bookingId":
            return b.bookingId
              .toLowerCase()
              .includes(bookingSearchValue.toLowerCase());
          case "bookingDate":
            const dateStr = format(new Date(b.bookingDate), "yyyy-MM-dd");
            return dateStr.includes(bookingSearchValue);
          case "childName":
            // Assuming booking has childName in some property
            // Adjust according to your actual data structure
            return (b.childName || "")
              .toLowerCase()
              .includes(bookingSearchValue.toLowerCase());
          case "scheduledDate":
            // Assuming booking has scheduledDate in some property
            // Adjust according to your actual data structure
            return (b.scheduledDate || "").includes(bookingSearchValue);
          case "vaccine":
            // Assuming booking has vaccine information in some property
            // Adjust according to your actual data structure
            return (b.vaccine || "")
              .toLowerCase()
              .includes(bookingSearchValue.toLowerCase());
          default:
            return true;
        }
      });
    }
  }

  // Filter by status
  const filteredBookings = customerBookings.filter((b) => {
    if (selectedStatus === "all") return true;

    const statusMap = {
      daDat: 1,
      daHoanThanh: 2,
      daHuy: 3,
    };

    return b.status === statusMap[selectedStatus];
  });

  // Handle customer selection
  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    // Reset booking search when changing customer
    setBookingSearchValue("");
  };

  // 1) Khi Bookings mount, đọc localStorage để khôi phục state
  useEffect(() => {
    const savedState = localStorage.getItem("bookingsState");
    if (savedState) {
      const {
        selectedCustomer,
        customerSearchValue,
        bookingSearchValue,
        selectedStatus,
      } = JSON.parse(savedState);

      // Gán lại state
      if (selectedCustomer) setSelectedCustomer(selectedCustomer);
      if (customerSearchValue) setCustomerSearchValue(customerSearchValue);
      if (bookingSearchValue) setBookingSearchValue(bookingSearchValue);
      if (selectedStatus) setSelectedStatus(selectedStatus);
    }
  }, []);

  // 2) Mỗi khi state thay đổi, lưu vào localStorage
  useEffect(() => {
    localStorage.setItem(
      "bookingsState",
      JSON.stringify({
        selectedCustomer,
        customerSearchValue,
        bookingSearchValue,
        selectedStatus,
      })
    );
  }, [
    selectedCustomer,
    customerSearchValue,
    bookingSearchValue,
    selectedStatus,
  ]);

  // 3) Gọi API để lấy danh sách booking
  useEffect(() => {
    const fetchBookings = async () => {
      const data = await getAllBookings();
      setBookings(data);
    };
    fetchBookings();
  }, []);

  // Handle booking click to navigate to details
  // Khi click vào 1 booking, chuyển sang BookingDetail
  const handleBookingClick = (booking) => {
    navigate(`../booking-detail/${booking.bookingId}`);
  };
  // Get status label and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 1:
        return {
          label: "Đã Đặt",
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
        };
      case 2:
        return {
          label: "Đã Hoàn Thành",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
        };
      case 3:
        return {
          label: "Đã Hủy",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
        };
      default:
        return {
          label: "Không xác định",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
        };
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-lg text-blue-800">
            Đang tải thông tin đặt lịch...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <AlertCircleIcon className="text-red-500 w-12 h-12 mx-auto mb-4" />
          <p className="text-center text-red-500 text-lg font-medium">
            {error}
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-blue-800 flex items-center">
            <ShieldIcon className="mr-2" />
            Quản Lý Lịch Tiêm Chủng
          </h1>
        </div>
      </div>

      {/* Main content - split into 3:5 ratio */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        {/* Left sidebar - 3/8 width (Customer List) */}
        <div className="w-3/8 pr-6">
          <div className="bg-white rounded-lg shadow-md sticky top-6">
            <div className="p-4 bg-blue-600 text-white rounded-t-lg">
              <h2 className="text-lg font-semibold">Danh Sách Khách Hàng</h2>
            </div>

            {/* Customer Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center mb-2">
                <div className="w-1/4 pr-1">
                  <select
                    value={customerSearchType}
                    onChange={(e) => {
                      setCustomerSearchType(e.target.value);
                      setCustomerSearchValue("");
                    }}
                    className="w-full h-full p-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="customerId">Mã KH</option>
                    <option value="customerName">Tên KH</option>
                    <option value="phone">SĐT</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                <div className="w-3/4">
                  <input
                    type="text"
                    value={customerSearchValue}
                    onChange={(e) => setCustomerSearchValue(e.target.value)}
                    placeholder={`Tìm kiếm ${
                      customerSearchType === "customerId"
                        ? "mã khách hàng"
                        : customerSearchType === "customerName"
                        ? "tên khách hàng"
                        : customerSearchType === "phone"
                        ? "số điện thoại"
                        : "email"
                    }`}
                    className="w-full h-full p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(100vh-300px)]">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <div
                    key={cust.customerId}
                    onClick={() => handleCustomerClick(cust)}
                    className={`p-4 mb-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedCustomer &&
                      selectedCustomer.customerId === cust.customerId
                        ? "bg-blue-50 border-blue-300"
                        : "bg-white border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">Mã: {cust.customerId}</p>
                      <p>
                        Tên: {cust.firstName} {cust.lastName}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 mt-1 flex justify-between">
                      <p>SĐT: {cust.phoneNumber}</p>
                      <p className="truncate max-w-[140px]">
                        Email: {cust.email || "---"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircleIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p>Không có khách hàng phù hợp</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content area - 5/8 width (Bookings) */}
        <div className="w-5/8">
          {selectedCustomer ? (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Booking của: {selectedCustomer.firstName}{" "}
                  {selectedCustomer.lastName}
                </h2>

                {/* Booking Search */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-1/4 pr-1">
                      <select
                        value={bookingSearchType}
                        onChange={(e) => {
                          setBookingSearchType(e.target.value);
                          setBookingSearchValue("");
                        }}
                        className="w-full h-full p-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="bookingId">Mã booking</option>
                        <option value="bookingDate">Ngày đặt</option>
                        <option value="childName">Tên đứa trẻ</option>
                        <option value="scheduledDate">Ngày tiêm</option>
                        <option value="vaccine">Vaccine</option>
                      </select>
                    </div>
                    <div className="w-3/4">
                      {bookingSearchType === "bookingDate" ||
                      bookingSearchType === "scheduledDate" ? (
                        <input
                          type="date"
                          value={bookingSearchValue}
                          onChange={(e) =>
                            setBookingSearchValue(e.target.value)
                          }
                          className="w-full h-full p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      ) : (
                        <input
                          type="text"
                          value={bookingSearchValue}
                          onChange={(e) =>
                            setBookingSearchValue(e.target.value)
                          }
                          placeholder={`Tìm kiếm ${
                            bookingSearchType === "bookingId"
                              ? "mã booking"
                              : bookingSearchType === "childName"
                              ? "tên đứa trẻ"
                              : "vaccine"
                          }`}
                          className="w-full h-full p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Filter */}
                <div className="mb-4 flex space-x-2">
                  <button
                    onClick={() => setSelectedStatus("all")}
                    className={`w-28 px-4 py-2 rounded-full text-sm font-medium transition duration-150 shadow-sm ${
                      selectedStatus === "all"
                        ? "bg-gray-500 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setSelectedStatus("daDat")}
                    className={`w-28 px-4 py-2 rounded-full text-sm font-medium transition duration-150 shadow-sm ${
                      selectedStatus === "daDat"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-200 text-blue-800 hover:bg-blue-300"
                    }`}
                  >
                    Đã Đặt
                  </button>
                  <button
                    onClick={() => setSelectedStatus("daHoanThanh")}
                    className={`w-28 px-4 py-2 rounded-full text-sm font-medium transition duration-150 shadow-sm ${
                      selectedStatus === "daHoanThanh"
                        ? "bg-green-600 text-white"
                        : "bg-green-200 text-green-800 hover:bg-green-300"
                    }`}
                  >
                    Đã Hoàn Thành
                  </button>
                  <button
                    onClick={() => setSelectedStatus("daHuy")}
                    className={`w-28 px-4 py-2 rounded-full text-sm font-medium transition duration-150 shadow-sm ${
                      selectedStatus === "daHuy"
                        ? "bg-red-600 text-white"
                        : "bg-red-200 text-red-800 hover:bg-red-300"
                    }`}
                  >
                    Đã Hủy
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 overflow-y-auto max-h-[calc(100vh-400px)]">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => {
                    const statusInfo = getStatusInfo(booking.status);
                    return (
                      <div
                        key={booking.bookingId}
                        onClick={() => handleBookingClick(booking)}
                        className="p-4 mb-3 border rounded-lg cursor-pointer flex justify-between items-center hover:shadow-md transition-all duration-200 border-gray-200"
                      >
                        <div>
                          <p className="font-semibold">
                            Mã: {booking.bookingId}
                          </p>
                          <p className="text-sm text-gray-600">
                            Ngày đặt:{" "}
                            {format(
                              new Date(booking.bookingDate),
                              "dd/MM/yyyy"
                            )}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`text-sm px-3 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.textColor} mr-3`}
                          >
                            {statusInfo.label}
                          </span>
                          <p className="font-medium">
                            {booking.totalAmount.toLocaleString()} VNĐ
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <AlertCircleIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p>Không có booking nào phù hợp</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center min-h-[calc(100vh-200px)] flex flex-col items-center justify-center">
              <AlertCircleIcon className="w-24 h-24 mx-auto text-blue-200 mb-4" />
              <p className="text-lg text-gray-500">
                Vui lòng chọn khách hàng từ danh sách bên trái
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Hoặc tìm kiếm khách hàng bằng ô tìm kiếm
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
