// src/pages/Staff/StaffPage.jsx
import React from "react";
import { Outlet, Link } from "react-router-dom";

import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiAlertTriangle,
  FiMessageSquare,
} from "react-icons/fi";

const StaffPage = () => {
  const staffName = "Nguyễn Văn A"; // Lấy từ API hoặc state

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Chào Mừng {staffName}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Quản lý khách hàng */}
          <Link
            to="/staff/customers"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center border-2 border-blue-200"
          >
            <div className="flex flex-col items-center">
              <FiUsers className="w-12 h-12 text-blue-600 mb-2" />
              <span className="text-gray-700 font-medium">
                Quản Lý Khách Hàng
              </span>
            </div>
          </Link>

          {/* Lịch đăng ký tiêm */}
          <Link
            to="/schedule"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <div className="flex flex-col items-center">
              <FiCalendar className="w-12 h-12 text-green-600 mb-2" />
              <span className="text-gray-700 font-medium">
                Lịch Đăng Ký Tiêm
              </span>
            </div>
          </Link>

          {/* Trang chủ */}
          <Link
            to="/home"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <div className="flex flex-col items-center">
              <FiHome className="w-12 h-12 text-orange-600 mb-2" />
              <span className="text-gray-700 font-medium">Trang Chủ</span>
            </div>
          </Link>

          {/* Báo cáo phản ứng */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center cursor-not-allowed">
            <div className="flex flex-col items-center">
              <FiAlertTriangle className="w-12 h-12 text-red-600 mb-2" />
              <span className="text-gray-700 font-medium">
                Báo Cáo Phản Ứng
              </span>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center cursor-not-allowed">
            <div className="flex flex-col items-center">
              <FiMessageSquare className="w-12 h-12 text-purple-600 mb-2" />
              <span className="text-gray-700 font-medium">Phản Hồi</span>
            </div>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default StaffPage;
