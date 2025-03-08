import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, ArrowRight, Syringe, Heart, Shield, User } from 'lucide-react';
import './Footer_1.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-health-theme">
            <Syringe className="health-icon" />
            <h2>Trung Tâm Tiêm Chủng <span>Sức Khỏe Toàn Diện</span></h2>
          </div>

          <div className="footer-main">
            <div className="footer-contact">
              <h3>Thông Tin Liên Hệ <Heart className="title-icon" /></h3>
              <div className="contact-items">
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <span>+84 123 456 789</span>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>info@vaccinationcenter.com</span>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" />
                  <span>123 Đường Sức Khỏe, TP.HCM</span>
                </div>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-links-column">
                <h3>Dịch Vụ <Shield className="title-icon" /></h3>
                <ul>
                  <li>
                    <ArrowRight className="link-icon" />
                    <a href="/services/vaccine">Tiêm chủng vaccine</a>
                  </li>
                  <li>
                    <ArrowRight className="link-icon" />
                    <a href="/services/health-check">Kiểm tra sức khỏe</a>
                  </li>
                  <li>
                    <ArrowRight className="link-icon" />
                    <a href="/services/consult">Tư vấn y tế</a>
                  </li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h3>Hỗ Trợ <User className="title-icon" /></h3>
                <ul>
                  <li>
                    <ArrowRight className="link-icon" />
                    <a href="/faq">Câu hỏi thường gặp</a>
                  </li>
                  <li>
                    <ArrowRight className="link-icon" />
                    <a href="/schedule">Lịch tiêm chủng</a>
                  </li>
                  <li>
                    <ArrowRight className="link-icon" />
                    <a href="/policy">Chính sách bảo mật</a>
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
                />
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
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className="social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter className="social-icon" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;