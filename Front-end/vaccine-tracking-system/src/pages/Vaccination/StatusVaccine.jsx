import React, { useState, useEffect } from "react";
import { FaSyringe, FaSearch, FaPrint } from "react-icons/fa";
import {
  BsClockFill,
  BsCheckCircleFill,
  BsExclamationCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getBookingDetails } from "../../apis/api"; // Import API

const StatusVaccine = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        const data = await getBookingDetails();
        console.log("📡 Booking Details Data:", data);
        setBookings(data);
      } catch (error) {
        setError("Không thể tải dữ liệu lịch tiêm chủng");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, []);

  // Hàm chuyển đổi trạng thái từ `status`
  const getVaccineStatus = (status) => {
    switch (status) {
      case 1:
        return "pending"; // Chờ xử lý
      case 2:
        return "completed"; // Đã tiêm
      case 3:
        return "upcoming"; // Sắp tiêm
      default:
        return "unknown";
    }
  };

  // Chuyển đổi timestamp thành ngày
  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Lọc danh sách vaccine theo `status` và tìm kiếm
  const filteredBookings = bookings.filter((booking) => {
    const status = getVaccineStatus(booking.status);
    return (
      booking.vaccine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      status === activeTab
    );
  });

  // Hàm xác định màu sắc trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Hàm xác định icon trạng thái
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <BsCheckCircleFill className="text-green-500" />;
      case "pending":
        return <BsExclamationCircleFill className="text-yellow-500" />;
      case "upcoming":
        return <BsClockFill className="text-blue-500" />;
      default:
        return null;
    }
  };

  // Xem chi tiết lịch tiêm
  const handleViewDetail = (booking) => {
    navigate("/react-vaccine2", { state: booking });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaSyringe className="text-blue-500 text-3xl" />
            <h1 className="text-3xl font-bold text-gray-800">
              Lịch Tiêm Chủng
            </h1>
          </div>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm vaccine..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
        </header>

        <div className="mb-6">
          <div className="flex justify-center space-x-4 border-b border-gray-200">
            {["completed", "pending", "upcoming"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium ${
                  activeTab === tab
                    ? `border-b-2 ${
                        tab === "completed"
                          ? "border-green-500 text-green-600"
                          : tab === "pending"
                          ? "border-yellow-500 text-yellow-600"
                          : "border-blue-500 text-blue-600"
                      }`
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab === "completed"
                  ? "Đã tiêm"
                  : tab === "pending"
                  ? "Chờ xác nhận"
                  : "Hủy tiêm"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <div
                  key={booking.bookingDetailId}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {booking.vaccine.name}
                    </h3>
                    {getStatusIcon(getVaccineStatus(booking.status))}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    Trạng thái: {getVaccineStatus(booking.status)}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Người đăng ký: {booking.booking.customer.firstName}{" "}
                    {booking.booking.customer.lastName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Trẻ em: {booking.child.firstName} {booking.child.lastName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Ngày tiêm dự kiến: {formatDate(booking.scheduledDate)}
                  </p>
                  <button
                    onClick={() => handleViewDetail(booking)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Xem chi tiết
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Không tìm thấy lịch tiêm chủng</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusVaccine;
