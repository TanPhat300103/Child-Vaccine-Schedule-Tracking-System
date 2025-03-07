// StaffPage.jsx
import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiAlertTriangle,
  FiMessageSquare,
  FiBarChart2,
  FiShield,
  FiBox,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";
import { FaSyringe } from "react-icons/fa";
import Notification from "../../components/common/Notification";

const StaffPage = ({ staffName = "Nguyễn Văn A" }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [vaccineMenuOpen, setVaccineMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleVaccineMenu = () => {
    setVaccineMenuOpen(!vaccineMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          ${isCollapsed ? "w-25" : "w-65"}
          bg-teal-700 text-white flex flex-col sticky top-0 h-screen overflow-y-auto
          transition-all duration-300 ease-in-out
        `}
      >
        {/* Logo và nút toggle */}
        <div className="p-4 border-b border-teal-600 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-2">
                <FaSyringe className="text-teal-600 w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold">MedCare Admin</h2>
              <p className="text-teal-200 text-sm">Hệ thống nhân viên y tế</p>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="text-white hover:bg-teal-600 p-2 rounded-full"
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-6">
          <div className="mb-4">
            <Link
              to="/staff"
              className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors text-sm font-medium shadow-sm"
            >
              <FiHome className="w-5 h-5" />
              {!isCollapsed && <span className="ml-2">Trang chủ</span>}
            </Link>
          </div>

          <ul className="space-y-1">
            <li>
              <Link
                to="/staff/customers"
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                <FiUsers className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">Quản lý khách hàng</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/staff/bookings"
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                <FiCalendar className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">Lịch đăng ký tiêm</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/staff/records"
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                <FiAlertTriangle className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">Báo cáo phản ứng</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/staff/feedbacks"
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                <FiMessageSquare className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">Phản hồi</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/staff/marketing-campains"
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                <FiBarChart2 className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">Marketing</span>}
              </Link>
            </li>
            <li className="relative group">
              <div
                onClick={toggleVaccineMenu}
                className="flex items-center p-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors cursor-pointer"
              >
                <FaSyringe className="w-5 h-5" />
                {!isCollapsed && (
                  <>
                    <span className="ml-3">Vaccine</span>
                    <FiChevronDown className="ml-auto w-4 h-4" />
                  </>
                )}
              </div>
              {!isCollapsed && (
                <ul
                  className={`mt-1 ml-8 space-y-1 ${
                    vaccineMenuOpen ? "block" : "hidden group-hover:block"
                  }`}
                >
                  <li>
                    <Link
                      to="/staff/vaccines"
                      className="flex items-center py-2 px-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      <FiShield className="w-4 h-4 mr-2" />
                      Quản lý vaccine
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/staff/vaccine-combos"
                      className="flex items-center py-2 px-3 text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors"
                    >
                      <FiBox className="w-4 h-4 mr-2" />
                      Vaccine combo
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-teal-600 mt-auto flex items-center">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold">
            {staffName.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">{staffName}</p>
              <p className="text-xs text-teal-300">Nhân viên Y tế</p>
            </div>
          )}
          <button
            onClick={() => navigate("/")}
            className="ml-auto text-teal-300 hover:text-white"
          >
            <FiLogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header
          className="
            sticky top-0 z-10
            mx-5 mt-5
            rounded-xl
            shadow-md
            bg-gradient-to-r from-teal-500 to-teal-700
            text-white p-3
          "
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Thông tin bên trái */}
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-extrabold">
                Trang Quản Lý Nhân Viên Y Tế
              </h1>
              <p className="text-teal-100 text-base mt-1">
                {format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })}
              </p>
              <p className="text-yellow-100 text-xl font-bold">{staffName}</p>
            </div>

            {/* Icon bên phải */}
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full bg-teal-600 hover:bg-teal-500 transition duration-150">
                <FiHelpCircle className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-teal-600 hover:bg-teal-500 transition duration-150 relative">
                <Notification roleId={2} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-full bg-teal-600 hover:bg-teal-500 transition duration-150 relative">
                <FiAlertTriangle className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full"></span>
              </button>
              <Link
                to="/staff/settings"
                className="p-2 rounded-full bg-teal-600 hover:bg-teal-500 transition duration-150"
              >
                <FiSettings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </header>

        {/* Nội dung chính */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-sm text-gray-500 text-center">
              © 2025 MedCare - Hệ thống quản lý y tế | Phiên bản 1.0.2
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StaffPage;