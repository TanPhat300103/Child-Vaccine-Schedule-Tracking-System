// src/components/footer/Footer.jsx
import React from 'react';
import './Footer.css'; // Tạo file CSS này để tùy chỉnh giao diện sau

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Phần logo hoặc tên hệ thống */}
        <div className="footer-logo">
          <h2>Vaccine Tracking System</h2>
        </div>

        {/* Danh sách liên kết */}
        <div className="footer-links">
          <ul>
            <li><a href="/about">Giới thiệu</a></li>
            <li><a href="/contact">Liên hệ</a></li>
            <li><a href="/terms">Điều khoản sử dụng</a></li>
            <li><a href="/privacy">Chính sách bảo mật</a></li>
          </ul>
        </div>

        {/* Thông tin liên hệ */}
        <div className="footer-contact">
          <p>Địa chỉ: Số 123, Đường ABC, Quận XYZ, TP.HCM</p>
          <p>Email: support@example.com</p>
          <p>SĐT: 0123-456-789</p>
        </div>
      </div>

      {/* Phần chân trang dưới cùng */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Vaccine Tracking System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
