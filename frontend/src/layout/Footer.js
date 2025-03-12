import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, ArrowRight, Calendar, Shield, Clock, MessageSquare,Github } from 'lucide-react';
import '../style/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-info">
            <div className="footer-contact-card">
              <div className="footer-contact-header">
                <h4>Liên Hệ Nhanh</h4>
              </div>
              <div className="footer-contact-body">
                <div className="footer-contact-item">
                  <Phone size={16} className="footer-icon" />
                  <span>+84 123 456 789</span>
                </div>
                <div className="footer-contact-item">
                  <Mail size={16} className="footer-icon" />
                  <span>khangqhse184031@fpt.edu.vn</span>
                </div>
                <div className="footer-contact-item">
                  <MapPin size={16} className="footer-icon" />
                  <span>123 Đường ABC, Q.1, TP.HCM</span>
                </div>
                <div className="footer-contact-item">
                  <Github size={16} className="footer-icon" />
                  <span>github.com/Kdz198</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-links-section">
            <div className="footer-links-column">
              <h4 className="footer-heading">Dịch Vụ</h4>
              <div className="footer-links">
                <a href="/services/regular" className="footer-link">
                  <ArrowRight size={14} className="footer-link-icon" />
                  <span>Tiêm chủng định kỳ</span>
                </a>
                <a href="/services/special" className="footer-link">
                  <ArrowRight size={14} className="footer-link-icon" />
                  <span>Vaccine đặc biệt</span>
                </a>
                <a href="/services/consultation" className="footer-link">
                  <ArrowRight size={14} className="footer-link-icon" />
                  <span>Tư vấn y tế</span>
                </a>
                <a href="/services/checkup" className="footer-link">
                  <ArrowRight size={14} className="footer-link-icon" />
                  <span>Khám sức khỏe</span>
                </a>
              </div>
            </div>

            <div className="footer-links-column">
              <h4 className="footer-heading">Hỗ Trợ</h4>
              <div className="footer-links">
                <a href="/faq" className="footer-link">
                  <ArrowRight size={14} className="footer-link-icon" />
                  <span>Câu hỏi thường gặp</span>
                </a>
                <a href="/schedule" className="footer-link">
                  <ArrowRight size={14} className="footer-link-icon" />
                  <span>Lịch tiêm chủng</span>
                </a>
                <a href="/privacy" className="footer-link">
                  <ArrowRight size={14} className="footer-link-icon" />
                  <span>Chính sách bảo mật</span>
                </a>
                <a href="/contact" className="footer-link">
                  <ArrowRight size={14} className="footer-link-icon" />
                  <span>Liên hệ</span>
                </a>
              </div>
            </div>

            <div className="footer-newsletter">
              <h4 className="footer-heading">Đăng Ký Nhận Tin</h4>
              <p className="footer-newsletter-text">Nhận thông tin mới nhất về vaccine và sức khỏe trẻ em.</p>
              <form className="footer-newsletter-form">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="footer-newsletter-input"
                />
                <button type="submit" className="footer-newsletter-button">
                  Đăng Ký
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-features">
          <div className="footer-feature">
            <div className="footer-feature-icon">
              <Calendar size={20} />
            </div>
            <div className="footer-feature-text">
              <h5>Đặt Lịch Dễ Dàng</h5>
              <p>Đặt lịch tiêm nhanh chóng</p>
            </div>
          </div>

          <div className="footer-feature">
            <div className="footer-feature-icon">
              <Shield size={20} />
            </div>
            <div className="footer-feature-text">
              <h5>Dịch Vụ An Toàn</h5>
              <p>Tiêu chuẩn y tế cao cấp</p>
            </div>
          </div>

          <div className="footer-feature">
            <div className="footer-feature-icon">
              <Clock size={20} />
            </div>
            <div className="footer-feature-text">
              <h5>Hỗ Trợ 24/7</h5>
              <p>Luôn sẵn sàng phục vụ</p>
            </div>
          </div>

          <div className="footer-feature">
            <div className="footer-feature-icon">
              <MessageSquare size={20} />
            </div>
            <div className="footer-feature-text">
              <h5>Tư Vấn Miễn Phí</h5>
              <p>Đội ngũ bác sĩ chuyên nghiệp</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© 2025 Trung Tâm Tiêm Chủng Vaccine Hoàng Tử Gió. Đã đăng ký bản quyền.</p>
          </div>

          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <Facebook size={16} className="footer-social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <Instagram size={16} className="footer-social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <Twitter size={16} className="footer-social-icon" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;