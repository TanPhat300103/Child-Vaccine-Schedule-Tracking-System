import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import {
  FiGrid,
  FiUsers,
  FiCalendar,
  FiUser,
  FiBarChart2,
  FiShield,
  FiBox,
  FiHome,
  FiMessageSquare,
  FiActivity,
  FiAlertTriangle,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { RiSyringeLine } from "react-icons/ri";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FaCashRegister } from "react-icons/fa";
import "../../style/AdminPage.css";

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, isLoggedIn, logout, isLoading } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isVaccineActive =
    location.pathname.startsWith("/admin/vaccines") ||
    location.pathname.startsWith("/admin/vaccine-combos");

  return (
    <div className="container-adminpage">
      {/* Sidebar */}
      <aside
        className={`sidebar-adminpage ${
          sidebarOpen ? "sidebar-open-adminpage" : "sidebar-closed-adminpage"
        }`}
      >
        {sidebarOpen ? (
          <div className="sidebar-header-adminpage">
            <div className="sidebar-logo-adminpage">
              <div className="icon-circle-adminpage">
                <RiSyringeLine className="syringe-icon-adminpage" />
              </div>
              <h1 className="sidebar-title-adminpage">Quản trị viên</h1>
            </div>
            <button onClick={toggleSidebar} className="toggle-btn-adminpage">
              <FiX size={24} />
            </button>
          </div>
        ) : (
          <div className="sidebar-header-closed-adminpage">
            <button onClick={toggleSidebar} className="toggle-btn-adminpage">
              <FiMenu size={24} />
            </button>
          </div>
        )}

        <nav className="nav-adminpage">
          <ul className="nav-list-adminpage">
            {sidebarOpen && (
              <li className="nav-section-adminpage">
                <p className="nav-section-title-adminpage">Tổng quan</p>
              </li>
            )}

            <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
                isActive={(match, location) => {
                  // Chỉ active khi đường dẫn chính xác là "/admin", không phải các route con
                  return location.pathname === "/admin";
                }}
              >
                <FiGrid
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Bảng điều khiển</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">Bảng điều khiển</span>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/staffs"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FiUser
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Quản lý nhân viên</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">
                    Quản lý nhân viên
                  </span>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/customers"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FiUsers
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Quản lý khách hàng</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">
                    Quản lý khách hàng
                  </span>
                )}
              </NavLink>
            </li>

            {sidebarOpen && (
              <li className="nav-section-adminpage">
                <p className="nav-section-title-adminpage">
                  Quản lý tiêm chủng
                </p>
              </li>
            )}

            <li>
              <NavLink
                to="/admin/bookings"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FiCalendar
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Lịch đăng ký tiêm</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">
                    Lịch đăng ký tiêm
                  </span>
                )}
              </NavLink>
            </li>

            <li className="nav-group-adminpage">
              <div
                className={`nav-item-adminpage ${
                  isVaccineActive ? "nav-item-active-adminpage" : ""
                }`}
              >
                <RiSyringeLine
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Vaccine</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">Vaccine</span>
                )}
              </div>
              <ul
                className={`nav-sublist-adminpage ${
                  isVaccineActive ? "nav-sublist-active-adminpage" : ""
                }`}
              >
                <li>
                  <NavLink
                    to="/admin/vaccines"
                    className={({ isActive }) =>
                      `nav-subitem-adminpage ${
                        isActive ? "nav-item-active-adminpage" : ""
                      }`
                    }
                  >
                    <FiShield className="nav-icon-adminpage" />
                    {sidebarOpen && (
                      <span className="nav-text-adminpage">
                        Quản lý vắc xin
                      </span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/vaccine-combos"
                    className={({ isActive }) =>
                      `nav-subitem-adminpage ${
                        isActive ? "nav-item-active-adminpage" : ""
                      }`
                    }
                  >
                    <FiBox className="nav-icon-adminpage" />
                    {sidebarOpen && (
                      <span className="nav-text-adminpage">Gói vắc xin</span>
                    )}
                  </NavLink>
                </li>
              </ul>
            </li>

            <li>
              <NavLink
                to="/admin/records"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FiActivity
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Báo cáo phản ứng</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">
                    Báo cáo phản ứng
                  </span>
                )}
              </NavLink>
            </li>

            {sidebarOpen && (
              <li className="nav-section-adminpage">
                <p className="nav-section-title-adminpage">Hệ thống</p>
              </li>
            )}

            <li>
              <NavLink
                to="/admin/feedbacks"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FiMessageSquare
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Phản hồi</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">Phản hồi</span>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/marketing-campaigns"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FiBarChart2
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">
                    Chiến dịch Marketing
                  </span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">
                    Chiến dịch Marketing
                  </span>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/payments"
                className={({ isActive }) =>
                  `nav-item-adminpage ${
                    isActive ? "nav-item-active-adminpage" : ""
                  }`
                }
              >
                <FaCashRegister
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Quản lý hóa đơn</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">Quản lý hóa đơn</span>
                )}
              </NavLink>
            </li>

            <li>
              <div
                onClick={handleLogout}
                className="nav-item-adminpage nav-logout-adminpage"
              >
                <FiLogOut
                  className={`nav-icon-adminpage ${
                    !sidebarOpen && "nav-icon-center-adminpage"
                  }`}
                />
                {sidebarOpen && (
                  <span className="nav-text-adminpage">Đăng xuất</span>
                )}
                {!sidebarOpen && (
                  <span className="nav-tooltip-adminpage">Đăng xuất</span>
                )}
              </div>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Header */}
      <header
        className="header-adminpage"
        style={{
          left: sidebarOpen ? "16rem" : "4rem",
          right: "0",
        }}
      >
        <div className="header-content-adminpage">
          <div className="header-left-adminpage">
            <h1 className="header-title-adminpage">
              TRANG QUẢN TRỊ TRUNG TÂM THEO DÕI TIÊM CHỦNG CHO TRẺ
            </h1>
            <p className="header-date-adminpage">
              {format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi })}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div
        className={`main-adminpage ${
          sidebarOpen ? "main-open-adminpage" : "main-closed-adminpage"
        }`}
      >
        <main className="content-adminpage">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="footer-adminpage">
          <p className="footer-text-adminpage">
            © 2025 VaccineCare - Hệ thống quản lý tiêm chủng | Phiên bản 1.0.2
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AdminPage;
