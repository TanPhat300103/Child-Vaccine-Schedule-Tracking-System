import React from "react";
import { useLocation } from "react-router-dom"; // Dùng để lấy dữ liệu từ navigate

const DetailVaccine2 = () => {
  const { state } = useLocation(); // Lấy dữ liệu vaccine từ state

  if (!state) {
    return (
      <p className="text-center text-red-500">Không có thông tin vaccine!</p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Chi Tiết Mũi Tiêm: {state.Vaccine}
          </h1>
          <p className="text-xl text-gray-600">{state.Center}</p>
        </div>

        {/* Vaccine Information */}
        <div className="space-y-6 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Thông tin Vaccine
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg shadow-md">
              <p className="text-gray-700">
                <strong>Tên Vaccine:</strong> {state.Vaccine}
              </p>
              <p className="text-gray-700">
                <strong>Ngày Tiêm:</strong>{" "}
                {new Date(state.Date).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                <strong>Giờ Tiêm:</strong>{" "}
                {new Date(state.Hour).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Thông Tin Liên Hệ
            </h2>
            <div className="bg-green-50 p-4 rounded-lg shadow-md">
              <p className="text-gray-700">
                <strong>Họ và Tên:</strong> {state.Name}
              </p>
              <p className="text-gray-700">
                <strong>Số Điện Thoại:</strong> {state.Phone}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {state.Email}
              </p>
            </div>
          </div>

          {/* Booking Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Thông Tin Đặt Lịch
            </h2>
            <div className="bg-yellow-50 p-4 rounded-lg shadow-md">
              <p className="text-gray-700">
                <strong>Trung Tâm Tiêm:</strong> {state.Center}
              </p>
              <p className="text-gray-700">
                <strong>Ngày Sinh:</strong>{" "}
                {new Date(state.DOB).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => window.history.back()} // Trở lại trang trước
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailVaccine2;
