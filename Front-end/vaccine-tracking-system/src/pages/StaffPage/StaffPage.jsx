import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiAlertTriangle,
  FiMessageSquare,
  FiBarChart2,
  FiShield,
  FiBox,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiLogOut,
  FiSettings,
  FiBell,
} from "react-icons/fi";
import { FaNotesMedical, FaSyringe, FaHospital } from "react-icons/fa";
import Notification from "../../components/common/Notification";

const StaffDashboard = ({ staffName = "Nguyễn Văn A" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [vaccineMenuOpen, setVaccineMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleVaccineMenu = () => {
    setVaccineMenuOpen(!vaccineMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-gradient-to-b from-teal-600 to-teal-800 text-white transition-all duration-300 ease-in-out fixed h-screen z-20`}
      >
        {/* Logo and Brand */}
        <div className="flex items-center justify-between p-4 border-b border-teal-500">
          <div className="flex items-center">
            <FaHospital
              className={`text-white w-8 h-8 ${!sidebarOpen && "mx-auto"}`}
            />
            {sidebarOpen && (
              <h1 className="ml-3 text-xl font-bold">MedCare Admin</h1>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="text-teal-200 hover:text-white focus:outline-none"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <ul className="space-y-2 px-3">
            {/* Home */}
            <li>
              <Link
                to="/home"
                className="flex items-center px-4 py-3 text-teal-100 hover:bg-teal-700 rounded-lg transition-all duration-200 group"
              >
                <FiHome className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`} />
                {sidebarOpen && <span className="ml-3">Trang chủ</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Trang chủ
                  </span>
                )}
              </Link>
            </li>

            {/* Quản Lý Khách Hàng */}
            <li>
              <Link
                to="/staff/customers"
                className="flex items-center px-4 py-3 text-teal-100 hover:bg-teal-700 rounded-lg transition-all duration-200 group"
              >
                <FiUsers className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`} />
                {sidebarOpen && (
                  <span className="ml-3">Quản lý khách hàng</span>
                )}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Quản lý khách hàng
                  </span>
                )}
              </Link>
            </li>

            {/* Lịch Đăng Ký Tiêm */}
            <li>
              <Link
                to="/staff/bookings"
                className="flex items-center px-4 py-3 text-teal-100 hover:bg-teal-700 rounded-lg transition-all duration-200 group"
              >
                <FiCalendar
                  className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                />
                {sidebarOpen && <span className="ml-3">Lịch đăng ký tiêm</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Lịch đăng ký tiêm
                  </span>
                )}
              </Link>
            </li>

            {/* Báo Cáo Phản Ứng */}
            <li>
              <Link
                to="/staff/records"
                className="flex items-center px-4 py-3 text-teal-100 hover:bg-teal-700 rounded-lg transition-all duration-200 group"
              >
                <FiAlertTriangle
                  className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                />
                {sidebarOpen && <span className="ml-3">Báo cáo phản ứng</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Báo cáo phản ứng
                  </span>
                )}
              </Link>
            </li>

            {/* Phản Hồi */}
            <li>
              <Link
                to="/staff/feedbacks"
                className="flex items-center px-4 py-3 text-teal-100 hover:bg-teal-700 rounded-lg transition-all duration-200 group"
              >
                <FiMessageSquare
                  className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                />
                {sidebarOpen && <span className="ml-3">Phản hồi</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Phản hồi
                  </span>
                )}
              </Link>
            </li>

            {/* Marketing */}
            <li>
              <Link
                to="/staff/marketing-campains"
                className="flex items-center px-4 py-3 text-teal-100 hover:bg-teal-700 rounded-lg transition-all duration-200 group"
              >
                <FiBarChart2
                  className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                />
                {sidebarOpen && <span className="ml-3">Marketing</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Marketing
                  </span>
                )}
              </Link>
            </li>

            {/* Vaccine */}
            <li>
              <div
                onClick={toggleVaccineMenu}
                className="flex items-center justify-between px-4 py-3 text-teal-100 hover:bg-teal-700 rounded-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center">
                  <FaSyringe
                    className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                  />
                  {sidebarOpen && <span className="ml-3">Vaccine</span>}
                </div>
                {sidebarOpen && (
                  <FiChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      vaccineMenuOpen ? "transform rotate-180" : ""
                    }`}
                  />
                )}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Vaccine
                  </span>
                )}
              </div>

              {/* Submenu */}
              {(vaccineMenuOpen || !sidebarOpen) && (
                <ul
                  className={`mt-2 space-y-1 ${sidebarOpen ? "pl-10" : "pl-0"}`}
                >
                  <li>
                    <Link
                      to="/staff/vaccines"
                      className="flex items-center px-4 py-2 text-teal-100 hover:bg-teal-700 rounded-lg transition-all duration-200 group"
                    >
                      <FiShield
                        className={`w-5 h-5 ${!sidebarOpen && "mx-auto"}`}
                      />
                      {sidebarOpen && (
                        <span className="ml-2">Quản lý vaccine</span>
                      )}
                      {!sidebarOpen && (
                        <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          Quản lý vaccine
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/staff/vaccine-combos"
                      className="flex items-center px-4 py-2 text-teal-100 hover:bg-teal-700 rounded-lg transition-all duration-200 group"
                    >
                      <FiBox
                        className={`w-5 h-5 ${!sidebarOpen && "mx-auto"}`}
                      />
                      {sidebarOpen && (
                        <span className="ml-2">Vaccine combo</span>
                      )}
                      {!sidebarOpen && (
                        <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          Vaccine combo
                        </span>
                      )}
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        {/* Bottom Section of Sidebar */}
        <div className="absolute bottom-0 w-full p-4 border-t border-teal-500">
          <Link
            to="/staff/settings"
            className="flex items-center px-4 py-3 text-teal-100 hover:bg-teal-700 rounded-lg transition-all duration-200 group"
          >
            <FiSettings className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`} />
            {sidebarOpen && <span className="ml-3">Cài đặt</span>}
            {!sidebarOpen && (
              <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                Cài đặt
              </span>
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-72" : "ml-20"
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              <span className="text-teal-600">Y tế MedCare</span> - Ban quản trị
            </h1>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-1 text-gray-500 hover:text-teal-600 focus:outline-none transition-colors">
                  <Notification roleId={2} />
                </button>
              </div>

              {/* User Profile */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
                  {staffName.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    {staffName}
                  </p>
                  <p className="text-xs text-gray-500">Quản trị viên</p>
                </div>
              </div>
              {/* Logout Button */}
              <button className="p-1 text-gray-500 hover:text-red-600 focus:outline-none transition-colors">
                <FiLogOut size={24} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {/* Welcome Card */}
          <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-teal-600 font-semibold">
                  Trung tâm quản lý y tế
                </div>
                <h2 className="mt-1 text-2xl font-semibold text-gray-900">
                  Chào mừng, {staffName}!
                </h2>
                <p className="mt-2 text-gray-600">
                  Chào mừng bạn đến với hệ thống quản lý tiêm chủng. Hãy xem các
                  thông tin quan trọng trong ngày hôm nay.
                </p>
              </div>
              <div className="md:shrink-0 bg-teal-500 md:w-48 flex items-center justify-center">
                <FaNotesMedical className="h-24 w-24 text-white" />
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Appointments Today */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FiCalendar className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Lịch hẹn hôm nay
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">24</p>
                </div>
              </div>
            </div>

            {/* Total Patients */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FiUsers className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Tổng bệnh nhân
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">1,248</p>
                </div>
              </div>
            </div>

            {/* Vaccines Available */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <FaSyringe className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Vaccine có sẵn
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">32</p>
                </div>
              </div>
            </div>

            {/* Reports */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <FiAlertTriangle className="h-8 w-8" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Báo cáo phản ứng
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Router Outlet */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffDashboard;
