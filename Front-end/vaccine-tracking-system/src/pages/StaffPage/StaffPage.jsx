// StaffPage.jsx
import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
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
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { FaHospital, FaSyringe } from "react-icons/fa";
import Notification from "../../components/common/Notification";

const StaffPage = ({ staffName = "Nguyễn Văn A" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [vaccineMenuOpen, setVaccineMenuOpen] = useState(false);
  const navigate = useNavigate();

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
            {/* Trang chủ */}
            <li>
              <Link
                to="/staff"
                className="flex items-center px-4 py-3 text-teal-100 hover:bg-teal-700 rounded-lg transition-all duration-200 group"
              >
                <FiHome className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`} />
                {sidebarOpen && <span className="ml-3">Trang chủ</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Trang chủ
                  </span>
                )}
              </Link>
            </li>

            {/* Quản lý khách hàng */}
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
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Quản lý khách hàng
                  </span>
                )}
              </Link>
            </li>

            {/* Lịch đăng ký tiêm */}
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
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Lịch đăng ký tiêm
                  </span>
                )}
              </Link>
            </li>

            {/* Báo cáo phản ứng */}
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
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Báo cáo phản ứng
                  </span>
                )}
              </Link>
            </li>

            {/* Phản hồi */}
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
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
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
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Marketing
                  </span>
                )}
              </Link>
            </li>

            {/* Vaccine với submenu */}
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
                      vaccineMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Vaccine
                  </span>
                )}
              </div>

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
                        <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
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
                        <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
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

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-teal-500">
          <Link
            to="/staff/settings"
            className="flex items-center px-4 py-3 text-teal-100 hover:bg-teal-700 rounded-lg transition-all duration-200 group"
          >
            <FiSettings className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`} />
            {sidebarOpen && <span className="ml-3">Cài đặt</span>}
            {!sidebarOpen && (
              <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
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
        {/* Header - giữ lại để không thay đổi khi chuyển route */}
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-white to-teal-50">
            {/* Left: Title */}
            <h1 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <FaHospital className="w-6 h-6 text-teal-600" />
              <span>
                <span className="text-teal-600">MedCare</span> - Bảng điều khiển
              </span>
            </h1>

            {/* Right: Notification, Profile, and Logout */}
            <div className="flex items-center space-x-6">
              {/* Notification */}
              <div className="relative">
                <Notification
                  roleId={2}
                  className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-100 rounded-full transition-all duration-200 focus:outline-none"
                />
              </div>

              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-3 focus:outline-none">
                  <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold text-lg">
                    {staffName.charAt(0)}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-gray-800">
                      {staffName}
                    </p>
                    <p className="text-xs text-gray-500">Nhân viên y tế</p>
                  </div>
                  <FiChevronDown className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-1">
                  <div className="py-2">
                    <Link
                      to="/staff/profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                    >
                      <FiSettings className="w-5 h-5 mr-2" />
                      <span>Hồ sơ</span>
                    </Link>
                    <button
                      onClick={() => navigate("/")}
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                    >
                      <FiLogOut className="w-5 h-5 mr-2" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Nội dung trang */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffPage;
