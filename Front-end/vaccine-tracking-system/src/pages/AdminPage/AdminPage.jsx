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
  FiAlertTriangle,
  FiMenu,
  FiX,
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

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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

  // Kiểm tra xem có đang ở trang Vaccine không
  const isVaccineActive =
    location.pathname.startsWith("/admin/vaccines") ||
    location.pathname.startsWith("/admin/vaccine-combos");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-20
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-72" : "w-20"}
          bg-gradient-to-b from-[#2B6DF5] to-[#3C7EFB]
          text-white font-bold border border-[#2B6DF5]
        `}
      >
        {sidebarOpen ? (
          <div className="flex items-center justify-between p-4 border-b border-[#2B6DF5]">
            <div className="flex items-center">
              {/* Vòng tròn icon */}
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
                {/* Thay thế màu #1F6AF2 bằng #2B6DF5 */}
                <RiSyringeLine className="text-[#2B6DF5] w-7 h-7" />
              </div>
              <h1 className="ml-3 text-xl font-bold">Quản Trị Viên</h1>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-white/90 focus:outline-none"
            >
              <FiX size={24} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end p-4 border-b border-[#2B6DF5]">
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-white/90 focus:outline-none"
            >
              <FiMenu size={24} />
            </button>
          </div>
        )}

        <nav className="mt-6">
          <ul className="space-y-2 px-3">
            {sidebarOpen && (
              <li className="px-3">
                <p className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                  Tổng quan
                </p>
              </li>
            )}

            {/* Bảng điều khiển */}
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-[#2B6DF5]"
                      : "hover:bg-[#2B75F5] hover:shadow-sm"
                  }`
                }
              >
                <FiGrid className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`} />
                {sidebarOpen && <span className="ml-3">Bảng điều khiển</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-[#2B75F5] text-white text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Bảng điều khiển
                  </span>
                )}
              </NavLink>
            </li>

            {/* Nhân viên Y tế */}
            <li>
              <NavLink
                to="/admin/staffs"
                className={({ isActive }) =>
                  `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-[#2B6DF5]"
                      : "hover:bg-[#2B75F5] hover:shadow-sm"
                  }`
                }
              >
                <FiUser className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`} />
                {sidebarOpen && <span className="ml-3">Nhân viên Y tế</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-[#2B75F5] text-white text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Nhân viên Y tế
                  </span>
                )}
              </NavLink>
            </li>

            {/* Bệnh nhân */}
            <li>
              <NavLink
                to="/admin/customers"
                className={({ isActive }) =>
                  `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-[#2B6DF5]"
                      : "hover:bg-[#2B75F5] hover:shadow-sm"
                  }`
                }
              >
                <FiUsers className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`} />
                {sidebarOpen && <span className="ml-3">Bệnh nhân</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-[#2B75F5] text-white text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Bệnh nhân
                  </span>
                )}
              </NavLink>
            </li>

            {sidebarOpen && (
              <li className="px-3">
                <p className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                  Quản lý tiêm chủng
                </p>
              </li>
            )}

            {/* Lịch hẹn tiêm */}
            <li>
              <NavLink
                to="/admin/bookings"
                className={({ isActive }) =>
                  `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-[#2B6DF5]"
                      : "hover:bg-[#2B75F5] hover:shadow-sm"
                  }`
                }
              >
                <FiCalendar
                  className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                />
                {sidebarOpen && <span className="ml-3">Lịch hẹn tiêm</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-[#2B75F5] text-white text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Lịch hẹn tiêm
                  </span>
                )}
              </NavLink>
            </li>

            {/* Vaccine */}
            <li className="group">
              <div
                className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  isVaccineActive
                    ? "bg-[#2B6DF5]"
                    : "hover:bg-[#2B75F5] hover:shadow-sm"
                }`}
              >
                <RiSyringeLine
                  className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                />
                {sidebarOpen && (
                  <>
                    <span className="ml-3">Vaccine</span>
                    <FiChevronDown className="ml-auto w-5 h-5" />
                  </>
                )}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-[#2B75F5] text-white text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Vaccine
                  </span>
                )}
              </div>
              <ul
                className={`${sidebarOpen ? "mt-2 pl-10" : ""} ${
                  isVaccineActive ? "block" : "hidden group-hover:block"
                }`}
              >
                <li>
                  <NavLink
                    to="/admin/vaccines"
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-[#2B6DF5]"
                          : "hover:bg-[#2B75F5] hover:shadow-sm"
                      }`
                    }
                  >
                    <FiShield
                      className={`w-5 h-5 ${!sidebarOpen && "mx-auto"}`}
                    />
                    {sidebarOpen && (
                      <span className="ml-2">Quản lý Vaccine</span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/vaccine-combos"
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-[#2B6DF5]"
                          : "hover:bg-[#2B75F5] hover:shadow-sm"
                      }`
                    }
                  >
                    <FiBox className={`w-5 h-5 ${!sidebarOpen && "mx-auto"}`} />
                    {sidebarOpen && <span className="ml-2">Gói Vaccine</span>}
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Biểu hiện sau tiêm */}
            <li>
              <NavLink
                to="/admin/records"
                className={({ isActive }) =>
                  `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-[#2B6DF5]"
                      : "hover:bg-[#2B75F5] hover:shadow-sm"
                  }`
                }
              >
                <FiActivity
                  className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                />
                {sidebarOpen && (
                  <span className="ml-3">Biểu hiện sau tiêm</span>
                )}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-[#2B75F5] text-white text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Biểu hiện sau tiêm
                  </span>
                )}
              </NavLink>
            </li>

            {sidebarOpen && (
              <li className="px-3">
                <p className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                  Hệ thống
                </p>
              </li>
            )}

            {/* Phản hồi bệnh nhân */}
            <li>
              <NavLink
                to="/admin/feedbacks"
                className={({ isActive }) =>
                  `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-[#2B6DF5]"
                      : "hover:bg-[#2B75F5] hover:shadow-sm"
                  }`
                }
              >
                <FiMessageSquare
                  className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                />
                {sidebarOpen && (
                  <span className="ml-3">Phản hồi bệnh nhân</span>
                )}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-[#2B75F5] text-white text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Phản hồi bệnh nhân
                  </span>
                )}
              </NavLink>
            </li>

            {/* Chiến dịch Y tế */}
            <li>
              <NavLink
                to="/admin/marketing-campains"
                className={({ isActive }) =>
                  `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-[#2B6DF5]"
                      : "hover:bg-[#2B75F5] hover:shadow-sm"
                  }`
                }
              >
                <FiBarChart2
                  className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                />
                {sidebarOpen && <span className="ml-3">Chiến dịch Y tế</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-[#2B75F5] text-white text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Chiến dịch Y tế
                  </span>
                )}
              </NavLink>
            </li>

            {/* Quản Lý Hóa Đơn */}
            <li>
              <NavLink
                to="/admin/payments"
                className={({ isActive }) =>
                  `relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-[#2B6DF5]"
                      : "hover:bg-[#2B75F5] hover:shadow-sm"
                  }`
                }
              >
                <FiBarChart2
                  className={`w-6 h-6 ${!sidebarOpen && "mx-auto"}`}
                />
                {sidebarOpen && <span className="ml-3">Quản Lý Hóa Đơn</span>}
                {!sidebarOpen && (
                  <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-[#2B75F5] text-white text-sm invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                    Quản Lý Hóa Đơn
                  </span>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>
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
        <div
          className="
            bg-gradient-to-r
            from-[#2B6DF5]
            to-[#3C7EFB]
            text-white font-bold
            rounded-b-lg shadow-md
            p-3 border border-[#2B6DF5]
          "
        >
          <div className="flex items-center justify-between">
            {/* Left Section: Title */}
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl">Trang Quản Trị Trung Tâm Tiêm Chủng</h1>
              <div>
                <p className="text-white text-base">
                  {format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })}
                </p>
                <p className="text-yellow-100 text-xl">
                  {adminData.firstName} {adminData.lastName}
                </p>
              </div>
            </div>
            {/* Right Section: Các nút chức năng */}
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full bg-[#2B6DF5] hover:bg-[#2B75F5] transition duration-150">
                <FiHelpCircle className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-[#2B6DF5] hover:bg-[#2B75F5] transition duration-150 relative">
                <FiMessageSquare className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-full bg-[#2B6DF5] hover:bg-[#2B75F5] transition duration-150 relative">
                <FiAlertTriangle className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-full bg-[#2B6DF5] hover:bg-[#2B75F5] transition duration-150">
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
              {/* Nút Logout */}
              <button
                onClick={() => navigate("/")}
                className="p-2 rounded-full bg-[#2B6DF5] hover:bg-[#2B75F5] transition duration-150"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 mt-20 ${
          sidebarOpen ? "ml-72" : "ml-20"
        }`}
      >
        <main className="mx-auto w-full py-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-sm text-gray-500 text-center">
              © 2025 VaccineCare - Hệ thống quản lý tiêm chủng | Phiên bản 1.0.2
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminPage;
