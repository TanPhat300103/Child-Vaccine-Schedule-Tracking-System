import React from "react";
import {
  Outlet,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./CustomerPage.css";

const CustomerLayout = () => {
  // Dummy flag, thay thế bằng logic xác thực thực tế sau này.
  const isLoggedIn = true; // TODO: Thay bằng kiểm tra trạng thái đăng nhập thật sự
  const location = useLocation();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, chuyển hướng sang trang đăng nhập
    return <Navigate to="/login" replace />;
  }

  // Nếu URL là /customer (không có sub-route) thì chuyển hướng mặc định sang /customer/profile
  if (location.pathname === "/customer") {
    return <Navigate to="/customer/profile" replace />;
  }

  return (
    <div className="customer-layout">
      <Header />
      <div className="customer-container">
        <aside className="customer-sidebar">
          <h3>Hồ Sơ Khách Hàng</h3>
          <ul>
            <li>
              <Link to="profile">Hồ sơ cá nhân</Link>
            </li>
            <li>
              <Link to="child">Hồ sơ trẻ em</Link>
            </li>
            {/* TODO: Nếu cần thêm mục khác, bạn có thể thêm vào đây */}
          </ul>
          <div className="sidebar-buttons">
            <button onClick={() => alert("Chức năng thêm con - TODO")}>
              (+) Thêm mới hồ sơ trẻ em
            </button>
            <button
              onClick={() => alert("Chức năng theo dõi lịch tiêm - TODO")}
            >
              Theo dõi lịch tiêm
            </button>
            <button onClick={() => navigate("/login")}>Đăng xuất</button>
          </div>
        </aside>
        <main className="customer-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
