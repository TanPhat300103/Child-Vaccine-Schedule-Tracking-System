import React, { useState, useEffect } from "react";
import { FaSyringe, FaSearch, FaPrint } from "react-icons/fa";
import {
  BsClockFill,
  BsCheckCircleFill,
  BsExclamationCircleFill,
} from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate

const VaccinationSchedule = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [vaccines, setVaccines] = useState([]); // Dữ liệu vaccine
  const [loading, setLoading] = useState(false); // Trạng thái tải
  const [error, setError] = useState(null); // Trạng thái lỗi khi gọi API
  const { state } = useLocation(); // Lấy dữ liệu từ state nếu có
  const navigate = useNavigate(); // Hook navigate để chuyển hướng

  // Hàm để chuyển timestamp thành ngày
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Chuyển đổi timestamp (giây) thành mili giây
    return date.toLocaleDateString(); // Định dạng ngày
  };

  // Hàm để chuyển timestamp thành giờ
  const formatHour = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString(); // Định dạng giờ
  };

  useEffect(() => {
    const fetchVaccines = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://67aa281d65ab088ea7e5d7ab.mockapi.io/Schedule"
        );
        if (!response.ok) {
          throw new Error("Có lỗi khi tải dữ liệu");
        }
        const data = await response.json();
        setVaccines(data); // Cập nhật dữ liệu vào state
      } catch (error) {
        setError(error.message); // Xử lý lỗi
      } finally {
        setLoading(false); // Dừng trạng thái loading
      }
    };

    fetchVaccines();
  }, []); // Chạy 1 lần khi component được render

  const getVaccineStatus = (appointmentDate) => {
    const today = new Date();
    const vaccineDate = new Date(appointmentDate);
    if (vaccineDate < today) {
      return "completed"; // Vaccine đã tiêm
    } else if (vaccineDate > today) {
      return "pending"; // Vaccine chưa tiêm
    } else {
      return "upcoming"; // Vaccine đang tiêm
    }
  };

  // Lọc các vaccine dựa trên trạng thái và tìm kiếm
  const filteredVaccines = vaccines.filter((vaccine) => {
    const vaccineStatus = getVaccineStatus(vaccine.appointmentDate);
    return (
      vaccine.Vaccine && // Sử dụng 'Vaccine' thay vì 'name'
      vaccine.Vaccine.toLowerCase().includes(searchTerm.toLowerCase()) &&
      vaccineStatus === activeTab
    );
  });

  // Chỉ lấy 6 vaccine cuối cùng
  const lastSixVaccines = filteredVaccines.slice(-6);

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

  // Chuyển hướng đến trang chi tiết vaccine
  const handleViewDetail = (vaccine) => {
    // Dùng navigate để chuyển hướng tới trang detail và truyền dữ liệu
    navigate("/vaccine-page2", { state: vaccine });
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
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 font-medium ${
                activeTab === "completed"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Đã tiêm
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 font-medium ${
                activeTab === "pending"
                  ? "border-b-2 border-yellow-500 text-yellow-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Chờ xác nhận
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-4 py-2 font-medium ${
                activeTab === "upcoming"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sắp tiêm
            </button>
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
            {lastSixVaccines.length > 0 ? (
              lastSixVaccines.map((vaccine) => (
                <div
                  key={vaccine.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {vaccine.Vaccine} {/* Hiển thị tên vaccine */}
                    </h3>
                    {getStatusIcon(vaccine.status)}{" "}
                    {/* Hiển thị biểu tượng trạng thái */}
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-2">
                      Vaccine: {vaccine.Vaccine}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Ngày tiêm: {formatDate(vaccine.Date)}{" "}
                      {/* Hiển thị ngày tiêm */}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Khung giờ: {vaccine.timeSlot || formatHour(vaccine.Hour)}{" "}
                      {/* Hiển thị giờ */}
                    </p>
                  </div>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor(
                      vaccine.status
                    )}`}
                  >
                    {vaccine.status
                      ? vaccine.status.charAt(0).toUpperCase() +
                        vaccine.status.slice(1)
                      : "Chưa xác định"}{" "}
                    {/* Tránh lỗi nếu không có status */}
                  </div>

                  {/* Nút để chuyển đến trang chi tiết vaccine */}
                  <button
                    onClick={() => handleViewDetail(vaccine)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    Xem chi tiết
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Không tìm thấy vaccine</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2 mx-auto">
            <FaPrint />
            Xuất bản ghi tiêm chủng
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaccinationSchedule;
