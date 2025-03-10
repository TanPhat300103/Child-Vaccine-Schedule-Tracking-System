import React from "react";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, ArrowRight, Syringe, Heart, Shield, User } from "lucide-react";
import "./Footer_1.css";

const Footer = () => {
  return (
    <footer
      className="footer"
      style={{
        background: "linear-gradient(135deg, #4852d8, #5a65f0)",
        color: "#fff",
      }}
    >
      <div
        className="footer-container"
        style={{
          background: "linear-gradient(135deg, #4852d8, #5a65f0)",
        }}
      >
        <div
          className="footer-top"
          style={{
            background: "linear-gradient(135deg, #4852d8, #5a65f0)",
          }}
        >
          <div className="footer-health-theme">
            <Syringe className="health-icon" style={{ color: "#fff" }} />
            <h2>
              Trung Tâm Tiêm Chủng <span>Sức Khỏe Toàn Diện</span>
            </h2>
          </div>

          <div
            className="footer-main"
            style={{
              background: "linear-gradient(135deg, #4852d8, #5a65f0)",
            }}
          >
            <div className="footer-contact">
              <h3>
                Thông Tin Liên Hệ <Heart className="title-icon" style={{ color: "#fff" }} />
              </h3>
              <div className="contact-items">
                <div className="contact-item">
                  <Phone className="contact-icon" style={{ color: "#fff" }} />
                  <span>+84 367921030.</span>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" style={{ color: "#fff" }} />
                  <span>hanptse184261@fpt.edu.vn.</span>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" style={{ color: "#fff" }} />
                  <span>khangqhse184031@fpt.edu.vn.</span>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" style={{ color: "#fff" }} />
                  <span>Biên Hòa, Đồng Nai.</span>
                </div>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-links-column">
                <h3>
                  Dịch Vụ <Shield className="title-icon" style={{ color: "#fff" }} />
                </h3>
                <ul>
                  <li>
                    <ArrowRight className="link-icon" style={{ color: "#fff" }} />
                    <a href="/services/vaccine" style={{ color: "#fff" }}>
                      Tiêm chủng vaccine.
                    </a>
                  </li>
                  <li>
                    <ArrowRight className="link-icon" style={{ color: "#fff" }} />
                    <a href="/services/health-check" style={{ color: "#fff" }}>
                      Kiểm tra sức khỏe.
                    </a>
                  </li>
                  <li>
                    <ArrowRight className="link-icon" style={{ color: "#fff" }} />
                    <a href="/services/consult" style={{ color: "#fff" }}>
                      Tư vấn y tế.
                    </a>
                  </li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h3>
                  Hỗ Trợ <User className="title-icon" style={{ color: "#fff" }} />
                </h3>
                <ul>
                  <li>
                    <ArrowRight className="link-icon" style={{ color: "#fff" }} />
                    <a href="/faq" style={{ color: "#fff" }}>
                      Câu hỏi thường gặp.
                    </a>
                  </li>
                  <li>
                    <ArrowRight className="link-icon" style={{ color: "#fff" }} />
                    <a href="/schedule" style={{ color: "#fff" }}>
                      Lịch tiêm chủng.
                    </a>
                  </li>
                  <li>
                    <ArrowRight className="link-icon" style={{ color: "#fff" }} />
                    <a href="/policy" style={{ color: "#fff" }}>
                      Chính sách bảo mật.
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-newsletter">
              <h3>Đăng Ký Nhận Tin</h3>
              <p>Thông tin cập nhật về vaccine và sức khỏe</p>
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  required
                  style={{ backgroundColor: "#fff", color: "#000" }} // Giữ input trắng để dễ đọc
                />
                <button type="submit" style={{ backgroundColor: "#fff", color: "#4852d8" }}>
                  Đăng Ký
                </button>
              </form>
            </div>
          </div>
        </div>

        <div
          className="footer-bottom"
          style={{
            background: "linear-gradient(135deg, #4852d8, #5a65f0)",
          }}
        >
          <div className="footer-copyright">
            <p>© 2025 Trung Tâm Tiêm Chủng. Đã đăng ký bản quyền.</p>
          </div>

          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className="social-icon" style={{ color: "#1877F2" }} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="social-icon" style={{ color: "#E4405F" }} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="social-icon" style={{ color: "#1DA1F2" }} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;