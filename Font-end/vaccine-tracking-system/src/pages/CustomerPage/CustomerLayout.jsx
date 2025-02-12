
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

const CustomerLayout = () => {
  // Dummy flag, thay bằng dữ liệu auth thực tế sau này.
  const isLoggedIn = true; // TODO: Thay bằng kiểm tra trạng thái đăng nhập thực tế

  const navigate = useNavigate();
  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, chuyển hướng sang trang đăng nhập
    navigate("/login");
    return null;
  }

  return (
    <div className="customer-layout">
      <Header />
      <div className="customer-container" style={{ display: "flex" }}>
        <aside className="customer-sidebar" style={{ width: "250px", padding: "20px" }}>
          <h3>Hồ Sơ Khách Hàng</h3>
          <ul>
            <li>
              <Link to="profile">Hồ sơ cá nhân</Link>
            </li>
            <li>
              <Link to="child">Hồ sơ trẻ em</Link>
            </li>
            {/* Nếu cần thêm mục khác, bạn có thể thêm vào đây */}
          </ul>
          {/* Các nút bổ sung */}
          <button onClick={() => alert("Chức năng thêm con - TODO")}>
            (+) Thêm mới hồ sơ trẻ em
          </button>
          <button onClick={() => alert("Chức năng theo dõi lịch tiêm - TODO")}>
            Theo dõi lịch tiêm
          </button>
          <button onClick={() => navigate("/login")}>
            Đăng xuất
          </button>
        </aside>
        <main className="customer-content" style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
