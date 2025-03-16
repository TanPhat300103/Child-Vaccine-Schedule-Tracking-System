import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FiUsers,
  FiCalendar,
  FiMessageSquare,
  FiMenu,
  FiX,
  FiLogOut,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  FaHospital,
  FaSyringe,
  FaCashRegister,
  FaBullhorn,
  FaBriefcaseMedical,
  FaVial,
  FaUsersCog,
} from "react-icons/fa";
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
          `${process.env.REACT_APP_API_BASE_URL}/staff/findid?id=${staffId}`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json", // Bỏ qua warning page
            },
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
                  <h1 className="sidebar-title-staffpage">Nhân viên</h1>
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
                    <FaUsersCog className="sidebar-icon-staffpage" />
                    {sidebarOpen && (
                      <span className="sidebar-nav-text-staffpage">
                        Hồ sơ nhân viên
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Hồ sơ nhân viên
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
                        Quản lý khách hàng
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Quản lý khách hàng
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
                        Lịch đăng ký tiêm
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Lịch đăng ký tiêm
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
                        Vắc xin
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">Vắc xin</span>
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
                        <FaVial className="sidebar-icon-staffpage" />
                        {sidebarOpen && (
                          <span className="sidebar-nav-text-staffpage">
                            Quản lý vắc xin
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
                        <FaBriefcaseMedical className="sidebar-icon-staffpage" />
                        {sidebarOpen && (
                          <span className="sidebar-nav-text-staffpage">
                            Gói vắc xin
                          </span>
                        )}
                      </NavLink>
                    </li>
                  </ul>
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
                        Báo cáo phản ứng
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Báo cáo phản ứng
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
                        Phản hồi
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Phản hồi
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
                    <FaBullhorn className="sidebar-icon-staffpage" />
                    {sidebarOpen && (
                      <span className="sidebar-nav-text-staffpage">
                        Chiến dịch Marketing
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Chiến dịch Marketing
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
                        Quản lý hóa đơn
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Quản lý hóa đơn
                      </span>
                    )}
                  </NavLink>
                </li>

                <li>
                  <div
                    onClick={handleLogout}
                    className="sidebar-nav-item-staffpage sidebar-logout-staffpage"
                  >
                    <FiLogOut className="sidebar-icon-staffpage" />
                    {sidebarOpen && (
                      <span className="sidebar-nav-text-staffpage">
                        Đăng xuất
                      </span>
                    )}
                    {!sidebarOpen && (
                      <span className="sidebar-tooltip-staffpage">
                        Đăng xuất
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
                  <h2 className="header-title-staffpage">
                    TRANG NHÂN VIÊN QUẢN LÝ
                  </h2>
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
                            {staffData?.firstName + " " + staffData?.lastName ||
                              "Nhân viên"}
                          </span>
                          <span className="header-profile-role-staffpage">
                            Nhân viên tiêm chủng
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
