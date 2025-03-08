// StaffPage.jsx
import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, NavLink } from "react-router-dom";
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
import { FaHospital, FaSyringe, FaNotesMedical } from "react-icons/fa";
import Notification from "../../components/common/Notification";
import { useAuth } from "../../components/common/AuthContext.jsx";

const StaffPage = () => {
  // Lấy thông tin nhân viên
  const { userInfo } = useAuth();
  const staffId = userInfo?.userId;

  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Các state khác
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [vaccineMenuOpen, setVaccineMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hàm điều khiển hiển thị header khi cuộn trang
  const controlHeader = () => {
    if (window.scrollY > lastScrollY) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
    setLastScrollY(window.scrollY);
  };

  // Fetch dữ liệu nhân viên
  useEffect(() => {
    if (!staffId) return;

    const fetchStaffData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/staff/findid?id=${staffId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu nhân viên");
        const data = await response.json();
        setStaffData(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchStaffData();
  }, [staffId]);

  // Lắng nghe sự kiện cuộn trang
  useEffect(() => {
    window.addEventListener("scroll", controlHeader);
    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [lastScrollY]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleVaccineMenu = () => {
    setVaccineMenuOpen(!vaccineMenuOpen);
  };

  return (
    <>
      {loading && (
        <div className="text-center text-gray-600 py-12">
          Đang tải dữ liệu...
        </div>
      )}
      {error && <div className="text-red-600 p-4 text-center">{error}</div>}
      {!loading && !error && !staffData && (
        <div className="text-gray-600 p-4 text-center">Không có dữ liệu</div>
      )}

      {!loading && !error && staffData && (
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar với viền bên phải */}
          <aside
            className={`${
              sidebarOpen ? "w-72" : "w-20"
            } bg-gradient-to-b from-teal-600 to-teal-800 text-white transition-all duration-300 ease-in-out fixed h-screen z-20 `}
          >
            {/* Logo & Brand: chỉ hiển thị khi sidebar mở */}
            {sidebarOpen && (
              <div className="flex items-center justify-between p-4 border-b border-teal-500">
                <div className="flex items-center">
                  <FaHospital className="text-white w-8 h-8" />
                  <h1 className="ml-3 text-xl font-bold">MedCare Admin</h1>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="text-teal-200 hover:text-white focus:outline-none"
                >
                  <FiX size={24} />
                </button>
              </div>
            )}
            {/* Khi sidebar thu gọn, chỉ hiển thị nút toggle ở góc trên */}
            {!sidebarOpen && (
              <div className="flex items-center justify-end p-4 border-b border-teal-500">
                <button
                  onClick={toggleSidebar}
                  className="text-teal-200 hover:text-white focus:outline-none"
                >
                  <FiMenu size={24} />
                </button>
              </div>
            )}

            {/* Navigation */}
            <nav className="mt-6">
              <ul className="space-y-2 px-3">
                {/* Trang chủ */}
                <li>
                  <NavLink
                    to="/staff"
                    className={({ isActive }) =>
                      `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive ? "bg-teal-600" : "hover:bg-teal-700"
                      }`
                    }
                  >
                    <FiHome
                      className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                    />
                    {sidebarOpen && <span className="ml-3">Trang chủ</span>}
                    {!sidebarOpen && (
                      <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                        Trang chủ
                      </span>
                    )}
                  </NavLink>
                </li>

                {/* Quản lý khách hàng */}
                <li>
                  <NavLink
                    to="/staff/customers"
                    className={({ isActive }) =>
                      `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive ? "bg-teal-600" : "hover:bg-teal-700"
                      }`
                    }
                  >
                    <FiUsers
                      className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                    />
                    {sidebarOpen && (
                      <span className="ml-3">Quản lý khách hàng</span>
                    )}
                    {!sidebarOpen && (
                      <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                        Quản lý khách hàng
                      </span>
                    )}
                  </NavLink>
                </li>

                {/* Lịch đăng ký tiêm */}
                <li>
                  <NavLink
                    to="/staff/bookings"
                    className={({ isActive }) =>
                      `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive ? "bg-teal-600" : "hover:bg-teal-700"
                      }`
                    }
                  >
                    <FiCalendar
                      className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                    />
                    {sidebarOpen && (
                      <span className="ml-3">Lịch đăng ký tiêm</span>
                    )}
                    {!sidebarOpen && (
                      <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                        Lịch đăng ký tiêm
                      </span>
                    )}
                  </NavLink>
                </li>

                {/* Báo cáo phản ứng */}
                <li>
                  <NavLink
                    to="/staff/records"
                    className={({ isActive }) =>
                      `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive ? "bg-teal-600" : "hover:bg-teal-700"
                      }`
                    }
                  >
                    <FiAlertTriangle
                      className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                    />
                    {sidebarOpen && (
                      <span className="ml-3">Báo cáo phản ứng</span>
                    )}
                    {!sidebarOpen && (
                      <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                        Báo cáo phản ứng
                      </span>
                    )}
                  </NavLink>
                </li>

                {/* Phản hồi */}
                <li>
                  <NavLink
                    to="/staff/feedbacks"
                    className={({ isActive }) =>
                      `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive ? "bg-teal-600" : "hover:bg-teal-700"
                      }`
                    }
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
                  </NavLink>
                </li>

                {/* Marketing */}
                <li>
                  <NavLink
                    to="/staff/marketing-campains"
                    className={({ isActive }) =>
                      `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive ? "bg-teal-600" : "hover:bg-teal-700"
                      }`
                    }
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
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/staff/payments"
                    className={({ isActive }) =>
                      `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                        isActive ? "bg-teal-600" : "hover:bg-teal-700"
                      }`
                    }
                  >
                    <FiBarChart2
                      className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                    />
                    {sidebarOpen && (
                      <span className="ml-3">Quản Lý Hóa Đơn</span>
                    )}
                    {!sidebarOpen && (
                      <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                        Marketing
                      </span>
                    )}
                  </NavLink>
                </li>

                {/* Menu Vaccine */}
                <li className="group">
                  <div className="relative flex items-center px-4 py-3 text-teal-100 hover:bg-teal-700 rounded-lg transition-all duration-200 cursor-pointer">
                    <FaSyringe
                      className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                    />
                    {sidebarOpen && (
                      <>
                        <span className="ml-3">Vaccine</span>
                        <FiChevronDown className="ml-auto w-5 h-5" />
                      </>
                    )}
                    {!sidebarOpen && (
                      <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                        Vaccine
                      </span>
                    )}
                  </div>
                  {/* Submenu Vaccine luôn hiển thị khi hover, đẩy các mục bên dưới xuống */}
                  <ul
                    className={`${
                      sidebarOpen ? "mt-2 pl-10" : ""
                    } hidden group-hover:block`}
                  >
                    <li>
                      <NavLink
                        to="/staff/vaccines"
                        className={({ isActive }) =>
                          `flex items-center px-4 py-2 text-teal-100 rounded-lg transition-all duration-200 ${
                            isActive ? "bg-teal-600" : "hover:bg-teal-700"
                          }`
                        }
                      >
                        <FiShield
                          className={`w-5 h-5 ${!sidebarOpen && "mx-auto"}`}
                        />
                        {sidebarOpen && (
                          <span className="ml-2">Quản lý vaccine</span>
                        )}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/staff/vaccine-combos"
                        className={({ isActive }) =>
                          `flex items-center px-4 py-2 text-teal-100 rounded-lg transition-all duration-200 ${
                            isActive ? "bg-teal-600" : "hover:bg-teal-700"
                          }`
                        }
                      >
                        <FiBox
                          className={`w-5 h-5 ${!sidebarOpen && "mx-auto"}`}
                        />
                        {sidebarOpen && (
                          <span className="ml-2">Vaccine combo</span>
                        )}
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>

            {/* Bottom Section (Settings) */}
            <div className="absolute bottom-0 w-full p-4 border-t border-teal-500">
              <NavLink
                to="/staff/settings"
                className={({ isActive }) =>
                  `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive ? "bg-teal-600" : "hover:bg-teal-700"
                  }`
                }
              >
                <FiSettings
                  className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                />
                {sidebarOpen && <span className="ml-3">Cài đặt</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-teal-800 text-teal-100 text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Cài đặt
                  </span>
                )}
              </NavLink>
            </div>
          </aside>

          {/* Header */}
          <header
            style={{
              left: sidebarOpen ? "calc(18rem + 20px)" : "calc(5rem + 20px)",
              right: "20px",
            }}
            className={`fixed top-0 z-10 transition-transform duration-300 ${
              showHeader ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-b-lg shadow-md p-3 ">
              <div className="flex items-center justify-between">
                {/* Left Section: Greeting (logo & icon removed) */}
                <div>
                  <h1 className="text-2xl font-semibold">
                    Xin chào, {staffData.firstName} {staffData.lastName}!
                  </h1>
                  <p className="mt-2 text-teal-100">
                    Bảng điều khiển nhân viên - Trung tâm tiêm chủng
                  </p>
                </div>

                {/* Right Section: Notification, Profile Dropdown */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Notification
                      roleId={2}
                      className="p-2 text-white hover:text-teal-200 hover:bg-teal-600 rounded-full transition-all duration-200 focus:outline-none"
                    />
                  </div>
                  <div className="relative group">
                    <button className="flex items-center space-x-3 focus:outline-none">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-teal-600 font-semibold text-lg border border-teal-300">
                        {staffData.firstName.charAt(0)}
                      </div>
                      <div className="text-left hidden md:block">
                        <p className="text-sm font-medium text-white">
                          {staffData.firstName} {staffData.lastName}
                        </p>
                        <p className="text-xs text-teal-100">Nhân viên y tế</p>
                      </div>
                      <FiChevronDown className="w-5 h-5 text-white group-hover:text-teal-200 transition-colors" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-1">
                      <div className="py-2">
                        <Link
                          to="/staff"
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
            </div>
          </header>

          {/* Main Content */}
          <div
            className={`flex-1 transition-all duration-300 ${
              sidebarOpen ? "ml-72" : "ml-20"
            }`}
          >
            <main className="pt-36">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </>
  );
};
export default StaffPage;
