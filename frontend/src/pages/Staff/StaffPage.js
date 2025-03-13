import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
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
  FiLogOut,
} from "react-icons/fi";
import { FaHospital, FaSyringe, FaCashRegister } from "react-icons/fa";
import { useAuth } from "../../components/AuthContext";
import "../../style/StaffPage.css";

const StaffPage = () => {
  const { userInfo } = useAuth();
  const staffId = userInfo?.userId;

  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { isLoggedIn, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isVaccineActive =
    location.pathname.startsWith("/staff/vaccines") ||
    location.pathname.startsWith("/staff/vaccine-combos");

  return (
    <>
      {loading && <div className="loading-staffpage">Đang tải dữ liệu...</div>}
      {error && <div className="error-staffpage">{error}</div>}
      {!loading && !error && !staffData && (
        <div className="no-data-staffpage">Không có dữ liệu</div>
      )}

      {!loading && !error && staffData && (
        <div className="container-staffpage">
          <aside
            className={`sidebar-staffpage ${
              sidebarOpen
                ? "sidebar-open-staffpage"
                : "sidebar-closed-staffpage"
            }`}
          >
            {sidebarOpen ? (
              <div className="sidebar-header-staffpage">
                <div className="sidebar-brand-staffpage">
                  <FaHospital className="sidebar-icon-staffpage" />
                  <h1 className="sidebar-title-staffpage">VaccineCare Staff</h1>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="sidebar-toggle-btn-staffpage"
                >
                  <FiX size={24} />
                </button>
              </div>
            ) : (
              <div className="sidebar-header-closed-staffpage">
                <button
                  onClick={toggleSidebar}
                  className="sidebar-toggle-btn-staffpage"
                >
                  <FiMenu size={24} />
                </button>
              </div>
            )}

            <nav className="sidebar-nav-staffpage">
              <ul className="sidebar-nav-list-staffpage">
                <li>
                  <NavLink
                    to="/staff"
                    end
                    className={({ isActive }) =>
                      `sidebar-nav-item-staffpage ${
                        isActive ? "sidebar-nav-item-active-staffpage" : ""
                      }`
                    }
                  >
                    <FiHome className="sidebar-icon-staffpage" />
                    {sidebarOpen && (
                      <span className="sidebar-nav-text-staffpage">
                        Hồ Sơ Nhân Viên
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Hồ Sơ Nhân Viên
                      </span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/staff/customers"
                    className={({ isActive }) =>
                      `sidebar-nav-item-staffpage ${
                        isActive ? "sidebar-nav-item-active-staffpage" : ""
                      }`
                    }
                  >
                    <FiUsers className="sidebar-icon-staffpage" />
                    {sidebarOpen && (
                      <span className="sidebar-nav-text-staffpage">
                        Quản Lý Khách Hàng
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Quản Lý Khách Hàng
                      </span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/staff/bookings"
                    className={({ isActive }) =>
                      `sidebar-nav-item-staffpage ${
                        isActive ? "sidebar-nav-item-active-staffpage" : ""
                      }`
                    }
                  >
                    <FiCalendar className="sidebar-icon-staffpage" />
                    {sidebarOpen && (
                      <span className="sidebar-nav-text-staffpage">
                        Lịch Đăng Ký Tiêm
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Lịch Đăng Ký Tiêm
                      </span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/staff/records"
                    className={({ isActive }) =>
                      `sidebar-nav-item-staffpage ${
                        isActive ? "sidebar-nav-item-active-staffpage" : ""
                      }`
                    }
                  >
                    <FiAlertTriangle className="sidebar-icon-staffpage" />
                    {sidebarOpen && (
                      <span className="sidebar-nav-text-staffpage">
                        Báo Cáo Phản Ứng
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Báo Cáo Phản Ứng
                      </span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/staff/feedbacks"
                    className={({ isActive }) =>
                      `sidebar-nav-item-staffpage ${
                        isActive ? "sidebar-nav-item-active-staffpage" : ""
                      }`
                    }
                  >
                    <FiMessageSquare className="sidebar-icon-staffpage" />
                    {sidebarOpen && (
                      <span className="sidebar-nav-text-staffpage">
                        Phản Hồi
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Phản Hồi
                      </span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/staff/marketing-campaigns"
                    className={({ isActive }) =>
                      `sidebar-nav-item-staffpage ${
                        isActive ? "sidebar-nav-item-active-staffpage" : ""
                      }`
                    }
                  >
                    <FiBarChart2 className="sidebar-icon-staffpage" />
                    {sidebarOpen && (
                      <span className="sidebar-nav-text-staffpage">
                        Chiến Dịch Marketing
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Chiến Dịch Marketing
                      </span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/staff/payments"
                    className={({ isActive }) =>
                      `sidebar-nav-item-staffpage ${
                        isActive ? "sidebar-nav-item-active-staffpage" : ""
                      }`
                    }
                  >
                    <FaCashRegister className="sidebar-icon-staffpage" />
                    {sidebarOpen && (
                      <span className="sidebar-nav-text-staffpage">
                        Quản Lý Hóa Đơn
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Quản Lý Hóa Đơn
                      </span>
                    )}
                  </NavLink>
                </li>
                <li className="sidebar-nav-group-staffpage">
                  <div
                    className={`sidebar-nav-item-staffpage ${
                      isVaccineActive ? "sidebar-nav-item-active-staffpage" : ""
                    }`}
                  >
                    <FaSyringe className="sidebar-icon-staffpage" />
                    {sidebarOpen && (
                      <span className="sidebar-nav-text-staffpage">
                        Vaccine
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">Vaccine</span>
                    )}
                  </div>
                  <ul
                    className={`sidebar-subnav-staffpage ${
                      isVaccineActive ? "sidebar-subnav-active-staffpage" : ""
                    }`}
                  >
                    <li>
                      <NavLink
                        to="/staff/vaccines"
                        className={({ isActive }) =>
                          `sidebar-subnav-item-staffpage ${
                            isActive ? "sidebar-nav-item-active-staffpage" : ""
                          }`
                        }
                      >
                        <FiShield className="sidebar-icon-staffpage" />
                        {sidebarOpen && (
                          <span className="sidebar-nav-text-staffpage">
                            Quản Lý Vaccine
                          </span>
                        )}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/staff/vaccine-combos"
                        className={({ isActive }) =>
                          `sidebar-subnav-item-staffpage ${
                            isActive ? "sidebar-nav-item-active-staffpage" : ""
                          }`
                        }
                      >
                        <FiBox className="sidebar-icon-staffpage" />
                        {sidebarOpen && (
                          <span className="sidebar-nav-text-staffpage">
                            Gói Vaccine
                          </span>
                        )}
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li>
                  <div
                    onClick={handleLogout}
                    className="sidebar-nav-item-staffpage sidebar-logout-staffpage"
                  >
                    <FiLogOut className="sidebar-icon-staffpage" />
                    {sidebarOpen && (
                      <span className="sidebar-nav-text-staffpage">
                        Đăng Xuất
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Đăng Xuất
                      </span>
                    )}
                  </div>
                </li>
              </ul>
            </nav>
          </aside>

          <div
            className={`main-content-staffpage ${
              sidebarOpen
                ? "main-content-open-staffpage"
                : "main-content-closed-staffpage"
            }`}
          >
            <header
              className="header-staffpage"
              style={{
                left: sidebarOpen ? "16rem" : "4rem",
                right: "0",
              }}
            >
              <div className="header-content-staffpage">
                <div className="header-left-staffpage">
                  <h2 className="header-title-staffpage">Trang Nhân Viên</h2>
                  <p className="header-subtitle-staffpage">
                    Quản lý hệ thống VaccineCare
                  </p>
                </div>
                <div className="header-right-staffpage">
                  <div className="header-profile-staffpage">
                    <button className="header-profile-btn-staffpage">
                      <div className="header-avatar-staffpage">
                        <NavLink to="/staff">
                          {staffData?.name ? staffData.name[0] : "S"}
                        </NavLink>
                      </div>
                      {sidebarOpen && (
                        <div className="header-profile-info-staffpage">
                          <span className="header-profile-name-staffpage">
                            {staffData?.name || "Nhân Viên"}
                          </span>
                          <span className="header-profile-role-staffpage">
                            Staff
                          </span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </header>
            <main className="main-staffpage">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffPage;
