import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Check,
  AlertCircle,
  FileText,
  ChevronRight,
  User,
  Baby,
  Syringe,
  Filter,
} from "lucide-react";
import { useAuth } from "../../components/common/AuthContext";

const BookingCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo?.userId) {
        setError("Không tìm thấy ID người dùng");
        setLoading(false);
        return;
      }

      try {
        const bookingsResponse = await fetch(
          `http://localhost:8080/booking/findbycustomer?customerId=${userInfo.userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!bookingsResponse.ok)
          throw new Error("Không tìm thấy thông tin booking");
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      } catch (err) {
        setError("Lỗi khi lấy thông tin: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo]);

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "all") return true;
    return filterStatus === "confirmed"
      ? booking.status === 1
      : booking.status !== 1;
  });

  const getStatusColor = (status) => {
    return status === 1
      ? "bg-emerald-100 text-emerald-800"
      : "bg-amber-100 text-amber-800";
  };

  const getStatusText = (status) => {
    return status === 1 ? "Đã xác nhận" : "Chờ xác nhận";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 font-medium">Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 text-red-500">
          <AlertCircle size={32} />
        </div>
        <p className="mt-4 text-gray-700 font-medium">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with wave */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" fill="none">
            <defs>
              <pattern
                id="vaccine-pattern"
                patternUnits="userSpaceOnUse"
                width="60"
                height="60"
                patternTransform="rotate(45)"
              >
                <path d="M10 10L50 50" stroke="white" strokeWidth="2" />
                <circle cx="30" cy="30" r="5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#vaccine-pattern)" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Lịch tiêm chủng của con bạn
              </h1>
              <p className="mt-2 text-lg text-blue-100">
                Theo dõi và quản lý lịch trình tiêm chủng để bảo vệ sức khỏe của
                trẻ
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={() => navigate("/book-vaccine")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Syringe size={16} className="mr-2" />
                Đặt lịch tiêm mới
              </button>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
          >
            <path
              fill="#f9fafb"
              d="M0,64L80,58.7C160,53,320,43,480,42.7C640,43,800,53,960,58.7C1120,64,1280,64,1360,64L1440,64L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filter controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Calendar size={20} className="mr-2 text-blue-600" />
            Danh sách lịch tiêm
          </h2>

          <div className="mt-3 md:mt-0 flex items-center">
            <Filter size={16} className="mr-2 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">Tất cả lịch tiêm</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="pending">Chờ xác nhận</option>
            </select>
          </div>
        </div>

        {filteredBookings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => (
              <Link
                to={`/booking-detail/${booking.bookingId}`}
                key={booking.bookingId}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden border border-gray-100 hover:border-blue-200"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {new Date(booking.bookingDate).toLocaleDateString(
                          "vi-VN",
                          { day: "2-digit", month: "2-digit", year: "numeric" }
                        )}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status === 1 ? (
                        <Check size={12} className="mr-1" />
                      ) : (
                        <Clock size={12} className="mr-1" />
                      )}
                      {getStatusText(booking.status)}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Lịch tiêm #{booking.bookingId}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start text-sm">
                      <Baby className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                      <span className="text-gray-500">
                        Khoa Tiêm chủng và Theo dõi Sức khỏe Trẻ em
                      </span>
                    </div>
                    <div className="flex items-start text-sm">
                      <User className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                      <span className="text-gray-500">
                        Phụ huynh: {userInfo?.fullName || "Chưa cập nhật"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-semibold text-gray-900">
                      {booking.totalAmount.toLocaleString("vi-VN")} VNĐ
                    </span>
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      Xem chi tiết
                      <ChevronRight size={16} className="ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100">
              <Calendar size={32} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Chưa có lịch tiêm nào
            </h3>
            <p className="text-gray-500 mb-6">
              Bạn chưa có lịch tiêm chủng nào. Hãy đặt lịch để theo dõi sức khỏe
              của trẻ.
            </p>
            <button
              onClick={() => navigate("/new-booking")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Syringe size={16} className="mr-2" />
              Đặt lịch tiêm ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCustomer;
