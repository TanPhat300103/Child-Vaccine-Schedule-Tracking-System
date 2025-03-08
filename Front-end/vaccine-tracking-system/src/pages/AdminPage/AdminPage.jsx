import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../components/common/AuthContext.jsx";
import {
  FiGrid,
  FiUsers,
  FiCalendar,
  FiChevronDown,
  FiUser,
  FiBarChart2,
  FiShield,
  FiBox,
  FiHome,
  FiMessageSquare,
  FiHelpCircle,
  FiLogOut,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
} from "react-icons/fi";
import { RiSyringeLine } from "react-icons/ri";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const AdminPage = () => {
  const adminData = {
    firstName: "Lord",
    lastName: "Of Cinder",
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const controlHeader = () => {
    if (window.scrollY > lastScrollY) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlHeader);
    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [lastScrollY]);

  const isVaccineActive =
    location.pathname.startsWith("/admin/vaccines") ||
    location.pathname.startsWith("/admin/vaccine-combos");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar với gradient background và viền */}
      <aside
        className={`
          ${isCollapsed ? "w-[100px]" : "w-[260px]"}
          bg-gradient-to-b from-teal-600 to-teal-800 text-white flex flex-col sticky top-0 h-screen overflow-y-auto
          transition-all duration-300 ease-in-out border border-gray-300
        `}
      >
        <div className="p-4 border-b border-teal-600 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full mb-2">
                <RiSyringeLine className="text-teal-600 w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold">VacciCare Admin</h2>
              <p className="text-teal-200 text-sm">
                Hệ thống quản lý tiêm chủng
              </p>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="text-white hover:bg-teal-600 p-2 rounded-full"
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-6">
          <div className="mb-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex ${
                  isCollapsed ? "justify-center" : "items-center"
                } px-4 py-2 rounded-lg transition-colors text-sm font-medium shadow-sm ${
                  isActive ? "bg-teal-600" : "hover:bg-teal-500"
                }`
              }
            >
              <FiHome className="w-5 h-5" />
              {!isCollapsed && <span className="ml-2">Trang chủ</span>}
            </NavLink>
          </div>

          {!isCollapsed && (
            <div className="mb-2 px-2">
              <p className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                Tổng quan
              </p>
            </div>
          )}

          <ul className="space-y-1 mb-6">
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `flex ${
                    isCollapsed ? "justify-center" : "items-center"
                  } p-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "bg-teal-600" : "hover:bg-teal-600"
                  }`
                }
              >
                <FiGrid className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">Bảng điều khiển</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/staffs"
                className={({ isActive }) =>
                  `flex ${
                    isCollapsed ? "justify-center" : "items-center"
                  } p-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "bg-teal-600" : "hover:bg-teal-600"
                  }`
                }
              >
                <FiUser className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">Nhân viên Y tế</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/customers"
                className={({ isActive }) =>
                  `flex ${
                    isCollapsed ? "justify-center" : "items-center"
                  } p-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "bg-teal-600" : "hover:bg-teal-600"
                  }`
                }
              >
                <FiUsers className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">Bệnh nhân</span>}
              </NavLink>
            </li>
          </ul>

          {!isCollapsed && (
            <div className="mb-2 px-2">
              <p className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                Quản lý tiêm chủng
              </p>
            </div>
          )}

          <ul className="space-y-1 mb-6">
            <li>
              <NavLink
                to="/admin/bookings"
                className={({ isActive }) =>
                  `flex ${
                    isCollapsed ? "justify-center" : "items-center"
                  } p-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "bg-teal-600" : "hover:bg-teal-600"
                  }`
                }
              >
                <FiCalendar className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">Lịch hẹn tiêm</span>}
              </NavLink>
            </li>
            <li className="group">
              <div
                className={`flex ${
                  isCollapsed ? "justify-center" : "items-center"
                } p-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  isVaccineActive ? "bg-teal-600" : "hover:bg-teal-600"
                }`}
              >
                <RiSyringeLine className="w-5 h-5" />
                {!isCollapsed && (
                  <>
                    <span className="ml-3">Vaccine</span>
                    <FiChevronDown className="ml-auto w-4 h-4" />
                  </>
                )}
              </div>
              {/* Submenu Vaccine hiển thị luôn khi hover, chiếm không gian */}
              <ul
                className={`${
                  isCollapsed ? "" : "ml-8"
                } space-y-1 hidden group-hover:block`}
              >
                <li>
                  <NavLink
                    to="/admin/vaccines"
                    className={({ isActive }) =>
                      `flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive ? "bg-teal-600" : "hover:bg-teal-600"
                      }`
                    }
                  >
                    <FiShield className="w-4 h-4 mr-2" />
                    Quản lý Vaccine
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/vaccine-combos"
                    className={({ isActive }) =>
                      `flex items-center py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive ? "bg-teal-600" : "hover:bg-teal-600"
                      }`
                    }
                  >
                    <FiBox className="w-4 h-4 mr-2" />
                    Gói Vaccine
                  </NavLink>
                </li>
              </ul>
            </li>
            <li>
              <NavLink
                to="/admin/records"
                className={({ isActive }) =>
                  `flex ${
                    isCollapsed ? "justify-center" : "items-center"
                  } p-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "bg-teal-600" : "hover:bg-teal-600"
                  }`
                }
              >
                <FiActivity className="w-5 h-5" />
                {!isCollapsed && (
                  <span className="ml-3">Biểu hiện sau tiêm</span>
                )}
              </NavLink>
            </li>
          </ul>

          {!isCollapsed && (
            <div className="mb-2 px-2">
              <p className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                Hệ thống
              </p>
            </div>
          )}

          <ul className="space-y-1">
            <li>
              <NavLink
                to="/admin/feedbacks"
                className={({ isActive }) =>
                  `flex ${
                    isCollapsed ? "justify-center" : "items-center"
                  } p-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "bg-teal-600" : "hover:bg-teal-600"
                  }`
                }
              >
                <FiMessageSquare className="w-5 h-5" />
                {!isCollapsed && (
                  <span className="ml-3">Phản hồi bệnh nhân</span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/marketing-campains"
                className={({ isActive }) =>
                  `flex ${
                    isCollapsed ? "justify-center" : "items-center"
                  } p-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "bg-teal-600" : "hover:bg-teal-600"
                  }`
                }
              >
                <FiBarChart2 className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">Chiến dịch Y tế</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/payments"
                className={({ isActive }) =>
                  `flex ${
                    isCollapsed ? "justify-center" : "items-center"
                  } p-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "bg-teal-600" : "hover:bg-teal-600"
                  }`
                }
              >
                <FiBarChart2 className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">Quản Lý Hóa Đơn</span>}
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Thông tin admin */}
        <div className="p-4 border-t border-teal-600 mt-auto flex items-center">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold">
            {adminData.firstName.charAt(0)}
            {adminData.lastName.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium">
                {adminData.firstName} {adminData.lastName}
              </p>
              <p className="text-xs text-teal-300">Quản trị viên Y tế</p>
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

      {/* Header */}
      <header
        style={{
          left: isCollapsed ? "calc(100px + 20px)" : "calc(260px + 20px)",
          right: "20px",
        }}
        className={`fixed top-0 z-10 transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-b-lg shadow-md p-3 border border-gray-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-extrabold">
                Trang Quản Trị Trung Tâm Tiêm Chủng
              </h1>
              <p className="text-teal-100 text-base mt-1">
                {format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })}
              </p>
              <p className="text-yellow-100 text-xl font-bold">
                {adminData.firstName} {adminData.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full bg-teal-600 hover:bg-teal-500 transition duration-150">
                <FiHelpCircle className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-teal-600 hover:bg-teal-500 transition duration-150 relative">
                <FiMessageSquare className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-full bg-teal-600 hover:bg-teal-500 transition duration-150 relative">
                <FiAlertTriangle className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-full bg-teal-600 hover:bg-teal-500 transition duration-150">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${
          isCollapsed ? "ml-[100px]" : "ml-[260px]"
        } transition-all duration-300`}
      >
        <main className="max-w-7xl mx-auto px-6 py-8 mt-36">
          <Outlet />
        </main>
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-sm text-gray-500 text-center">
              © 2025 VacciCare - Hệ thống quản lý tiêm chủng | Phiên bản 1.0.2
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminPage;
