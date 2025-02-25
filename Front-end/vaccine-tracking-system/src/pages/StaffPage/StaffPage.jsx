import React from "react";
import { Outlet, Link } from "react-router-dom";
import {
  FiUsers,
  FiCalendar,
  FiAlertTriangle,
  FiMessageSquare,
  FiBarChart2,
  FiShield,
  FiBox,
  FiFolder,
  FiChevronDown,
  FiHome,
} from "react-icons/fi";

const StaffPage = () => {
  const staffName = "Nguyễn Văn A"; // Lấy từ API hoặc state

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Header trong sidebar (Home + Staff Dashboard) */}
        <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
          {/* Nút Home nổi bật */}
          <Link
            to="/home"
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiHome className="mr-2" />
            Home
          </Link>
          {/* Tiêu đề Dashboard */}
          <h2 className="text-xl font-bold">Staff Dashboard</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            {/* Quản Lý Khách Hàng */}
            <li>
              <Link
                to="/staff/customers"
                className="flex items-center p-2 text-sm font-medium rounded hover:bg-gray-700 transition-colors"
              >
                <FiUsers className="w-5 h-5" />
                <span className="ml-3">Quản Lý Khách Hàng</span>
              </Link>
            </li>

            {/* Lịch Đăng Ký Tiêm */}
            <li>
              <Link
                to="/staff/schedule"
                className="flex items-center p-2 text-sm font-medium rounded hover:bg-gray-700 transition-colors"
              >
                <FiCalendar className="w-5 h-5" />
                <span className="ml-3">Lịch Đăng Ký Tiêm</span>
              </Link>
            </li>

            {/* Báo Cáo Phản Ứng (chưa mở) */}
            <li>
              <button
                className="flex items-center p-2 text-sm font-medium rounded cursor-not-allowed opacity-50"
                disabled
              >
                <FiAlertTriangle className="w-5 h-5" />
                <span className="ml-3">Báo Cáo Phản Ứng</span>
              </button>
            </li>

            {/* Phản Hồi (chưa mở) */}
            <li>
              <button
                className="flex items-center p-2 text-sm font-medium rounded cursor-not-allowed opacity-50"
                disabled
              >
                <FiMessageSquare className="w-5 h-5" />
                <span className="ml-3">Phản Hồi</span>
              </button>
            </li>

            {/* Vaccine (gộp Quản Lý Vaccine và Vaccine Combo) */}
            <li className="relative group">
              {/* Mục chính Vaccine */}
              <div className="flex items-center p-2 text-sm font-medium rounded hover:bg-gray-700 transition-colors cursor-pointer">
                {/* Icon thể hiện có submenu (folder + mũi tên) */}
                <FiFolder className="w-5 h-5" />
                <span className="ml-3">Vaccine</span>
                <FiChevronDown className="ml-auto w-4 h-4" />
              </div>

              {/* Submenu hiển thị khi hover */}
              <ul className="mt-1 ml-6 space-y-1 hidden group-hover:block">
                {/* Quản Lý Vaccine */}
                <li>
                  <Link
                    to="/staff/vaccines"
                    className="flex items-center text-sm font-medium hover:text-gray-300 transition-colors"
                  >
                    <FiShield className="w-4 h-4 mr-2" />
                    Quản Lý Vaccine
                  </Link>
                </li>
                {/* Vaccine Combo */}
                <li>
                  <Link
                    to="/staff/vaccine-combos"
                    className="flex items-center text-sm font-medium hover:text-gray-300 transition-colors"
                  >
                    <FiBox className="w-4 h-4 mr-2" />
                    Vaccine Combo
                  </Link>
                </li>
              </ul>
            </li>

            {/* Marketing */}
            <li>
              <Link
                to="/staff/marketing-campains"
                className="flex items-center p-2 text-sm font-medium rounded hover:bg-gray-700 transition-colors"
              >
                <FiBarChart2 className="w-5 h-5" />
                <span className="ml-3">Marketing</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Bạn có thể tùy ý đặt thông tin StaffName trong header hoặc ẩn đi */}
        <header className="bg-white shadow-sm">
          <div className="mx-auto px-4 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Chào Mừng {staffName}
            </h1>
          </div>
        </header>

        <main className="px-4 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffPage;
