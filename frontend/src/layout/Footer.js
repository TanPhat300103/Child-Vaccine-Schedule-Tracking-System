import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
  Syringe,
  Heart,
  Shield,
  User,
} from "lucide-react";
import "../style/Footer.css";
import { useAuth } from "../components/AuthContext";

const Footer = () => {
  // Lấy trạng thái đăng nhập từ useAuth
  const { isLoggedIn } = useAuth(); // Giả sử useAuth trả về object với thuộc tính user, user sẽ là null nếu chưa đăng nhập

  // Định nghĩa các đường dẫn cho mục "DỊCH VỤ" dựa trên trạng thái đăng nhập
  const serviceLinks = [
    { label: "Tiêm chủng vắc xin", path: isLoggedIn ? "/vaccines" : "/login" },
    { label: "Đặt lịch tiêm chủng", path: isLoggedIn ? "/booking" : "/login" },
    { label: "Tổng quan cá nhân", path: isLoggedIn ? "/login" : "/login" }, // Đường dẫn "/login" giữ nguyên vì đây là trang đăng nhập
  ];

  return (
    <footer
      className="footer"
      style={{
        background: "linear-gradient(135deg, #6e66e3 0%, #5db8e6 100%)",
      }}
    >
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-health-theme">
            <Syringe className="health-icon" style={{ color: "#fff" }} />
            <h2>
              VaccineCare <span>Sức Khỏe Toàn Diện</span>
            </h2>
          </div>

          <div className="footer-main">
            <div className="footer-contact">
              <h3>
                THÔNG TIN LIÊN HỆ <Heart className="title-icon" />
              </h3>
              <div className="contact-items">
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <span>+84 367921030</span>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>hanptse184261@fpt.edu.vn</span>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" />
                  <span>Biên Hòa, Đồng Nai</span>
                </div>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-links-column">
                <h3>
                  DỊCH VỤ <Shield className="title-icon" />
                </h3>
                <ul>
                  {serviceLinks.map((link, index) => (
                    <li key={index}>
                      <ArrowRight className="link-icon" />
                      <a href={link.path}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-links-column">
                <h3>
                  HỖ TRỢ <User className="title-icon" />
                </h3>
                <ul>
                  <li>
                    <ArrowRight className="link-icon" />
                    <a href="/handbook/pre-post-notes">Câu hỏi thường gặp</a>
                  </li>
                  <li>
                    <ArrowRight className="link-icon" />
                    <a href="/handbook/vaccination-process">
                      Quy trình tiêm chủng
                    </a>
                  </li>
                  <li>
                    <ArrowRight className="link-icon" />
                    <a href="/policy">Chính sách bảo mật</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-newsletter">
              <h3>ĐĂNG KÝ NHẬN TIN</h3>
              <p>Thông tin cập nhật về vắc xin và sức khỏe</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Nhập email của bạn" required />
                <button type="submit">Đăng Ký</button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© 2025 Trung Tâm Tiêm Chủng. Đã đăng ký bản quyền.</p>
          </div>

          <div className="footer-social">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="social-icon" style={{ color: "#1877F2" }} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="social-icon" style={{ color: "#E4405F" }} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="social-icon" style={{ color: "#1DA1F2" }} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
