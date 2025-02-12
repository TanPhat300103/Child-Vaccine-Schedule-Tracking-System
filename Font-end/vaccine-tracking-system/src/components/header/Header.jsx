import React, { useState, useEffect } from "react";
// TODO: Update the auth import after creating the auth file
// import { getAuthStatus } from "./auth";
import { useNavigate } from "react-router-dom"; 
import "./Header.css";

const Header = () => {
  // Sử dụng giá trị dummy để mô phỏng trạng thái đăng nhập: set true nếu muốn mô phỏng trạng thái đã đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  // TODO: Khi tạo file auth, thay thế useEffect này để cập nhật trạng thái đăng nhập thực tế từ auth
  useEffect(() => {
    // Giả lập cập nhật trạng thái đăng nhập
    // Ví dụ: setIsLoggedIn(getAuthStatus());
    // Hiện tại, bạn có thể chỉnh false hoặc true theo nhu cầu kiểm tra
    setIsLoggedIn(true); // hoặc setIsLoggedIn(true) để kiểm tra trạng thái đã đăng nhập
  }, []);

  // Trả về component Header với trạng thái đăng nhập hiện tại
  return (
    <div className="header">
      <div className="top-bar">
        <div className="logo" onClick={() => navigate("/")}>LOGO</div>
        <input type="text" className="search-bar" placeholder="SEARCH" />

        <div className="auth-section">
          {isLoggedIn ? (
            <>
              <div className="notice">Notice</div>
              <div className="user">User</div>
            </>
          ) : (
            <>
              <button className="login" onClick={() => setIsLoggedIn(true)}>LOGIN</button>
              <button className="signup" onClick={() => navigate("/signup")}>SIGN UP</button>
            </>
          )}
        </div>
      </div>

      <div className="nav-bar">
        <a onClick={() => navigate("/about")}>GIỚI THIỆU</a>
        <a onClick={() => navigate("/packages")}>GÓI TIÊM</a>
        <a onClick={() => navigate("/pricing")}>BẢNG GIÁ</a>
        <a onClick={() => navigate("/process")}>QUY TRÌNH</a>
        <a onClick={() => navigate("/locations")}>ĐỊA ĐIỂM</a>
        <a onClick={() => navigate("/contact")} className="contact">LIÊN HỆ </a>
      </div>

      <div className="sub-footer">
        <span className="vaccine-center">TRUNG TÂM TIÊM CHỦNG VACCINE</span>
        <a href="#" className="register"> Đăng kí tiêm</a>
      </div>
    </div>
  );
};

export default Header;
