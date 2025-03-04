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
import Notification from "../../components/common/Notification";

const StaffPage = () => {
  const staffName = "Nguyễn Văn A"; // Lấy từ API hoặc state

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar với kích thước phóng to (w-80) */}
      <aside className="w-80 bg-gray-900 text-white flex flex-col sticky top-0 h-screen overflow-y-auto">
        {/* Header trong sidebar: Home và Staff Dashboard */}
        <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
          {/* Nút Home nổi bật */}
          <Link
            to="/home"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xl"
          >
            <FiHome className="mr-2 w-6 h-6" />
            Home
          </Link>
          {/* Tiêu đề Dashboard */}
          <h2 className="text-2xl font-bold">Staff Dashboard</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-3">
            {/* Quản Lý Khách Hàng */}
            <li>
              <Link
                to="/staff/customers"
                className="flex items-center p-3 text-lg font-medium rounded hover:bg-gray-700 transition-colors"
              >
                <FiUsers className="w-6 h-6" />
                <span className="ml-4">Quản Lý Khách Hàng</span>
              </Link>
            </li>

            {/* Lịch Đăng Ký Tiêm */}
            <li>
              <Link
                to="/staff/bookings"
                className="flex items-center p-3 text-lg font-medium rounded hover:bg-gray-700 transition-colors"
              >
                <FiCalendar className="w-6 h-6" />
                <span className="ml-4">Lịch Đăng Ký Tiêm</span>
              </Link>
            </li>

            {/* Báo Cáo Phản Ứng (chưa mở) */}
            <li>
              <Link
                to="/staff/records"
                className="flex items-center p-3 text-lg font-medium rounded hover:bg-gray-700 transition-colors"
              >
                <FiAlertTriangle className="w-6 h-6" />
                <span className="ml-4">Báo Cáo Phản Ứng</span>
              </Link>
            </li>

            {/* Phản Hồi (chưa mở) */}
            <li>
              <Link
                to="/staff/feedbacks"
                className="flex items-center p-3 text-lg font-medium rounded hover:bg-gray-700 transition-colors"
              >
                <FiMessageSquare className="w-6 h-6" />
                <span className="ml-4">Phản Hồi</span>
              </Link>
            </li>
            {/* Marketing */}
            <li>
              <Link
                to="/staff/marketing-campains"
                className="flex items-center p-3 text-lg font-medium rounded hover:bg-gray-700 transition-colors"
              >
                <FiBarChart2 className="w-6 h-6" />
                <span className="ml-4">Marketing</span>
              </Link>
            </li>

            {/* Vaccine (gộp Quản Lý Vaccine và Vaccine Combo) */}
            <li className="relative group">
              {/* Mục chính Vaccine */}
              <div className="flex items-center p-3 text-lg font-medium rounded hover:bg-gray-700 transition-colors cursor-pointer">
                {/* Icon hiển thị có submenu */}
                <FiFolder className="w-6 h-6" />
                <span className="ml-4">Vaccine</span>
                <FiChevronDown className="ml-auto w-5 h-5" />
              </div>

              {/* Submenu hiển thị khi hover */}
              <ul className="mt-1 ml-8 space-y-2 hidden group-hover:block">
                {/* Quản Lý Vaccine */}
                <li>
                  <Link
                    to="/staff/vaccines"
                    className="flex items-center text-lg font-medium hover:text-gray-300 transition-colors"
                  >
                    <FiShield className="w-5 h-5 mr-2" />
                    Quản Lý Vaccine
                  </Link>
                </li>
                {/* Vaccine Combo */}
                <li>
                  <Link
                    to="/staff/vaccine-combos"
                    className="flex items-center text-lg font-medium hover:text-gray-300 transition-colors"
                  >
                    <FiBox className="w-5 h-5 mr-2" />
                    Vaccine Combo
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="mx-auto px-4 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Chào Mừng {staffName}
            </h1>
            {/* Component Notification */}
            <div className="mt-2">
              <Notification roleId={2} />
            </div>
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
