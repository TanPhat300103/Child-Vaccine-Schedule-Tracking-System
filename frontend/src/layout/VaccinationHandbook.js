import React from 'react';
import { Syringe, Info, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../style/vaccination-handbook.css';

function VaccinationHandbook() {
  return (
    <div className="vaccination-handbook-container">
      {/* Header (Hero Section) */}
      <div className="handbook-hero">
        <Link to="/" className="back-button">
          <ArrowLeft size={20} />
          Quay lại
        </Link>
        <div className="hero-content">
          <h1 className="hero-title">Quy trình tiêm chủng</h1>
          <p className="hero-subtitle">
            Khám phá hành trình tiêm chủng an toàn và hiệu quả với từng bước chi tiết.
          </p>
        </div>
        <div className="hero-overlay"></div>
      </div>

      {/* Nội dung chính */}
      <div className="handbook-main">
        {/* Phần giới thiệu */}
        <section className="intro-section">
          <h2 className="section-title">Tại sao cần hiểu quy trình?</h2>
          <div className="intro-quote">
            <div className="quote-icon">“</div>
            <p>
              Tiêm chủng không chỉ là một mũi tiêm – đó là hành trình bảo vệ sức khỏe bạn và cộng đồng. Hiểu rõ quy trình giúp bạn chuẩn bị tốt hơn, giảm thiểu lo lắng và đảm bảo an toàn tối đa.
            </p>
            <div className="quote-author">
              — GS.TS. Hoàng Văn Minh, Chuyên gia Y tế Công cộng
            </div>
          </div>
        </section>

        {/* Các bước (Process Timeline) */}
        <section className="steps-section">
          <h2 className="section-title">Quy trình tiêm chủng</h2>
          <div className="process-timeline">
            <div className="timeline-line"></div>
            <div className="timeline-steps">
              <div className="timeline-step">
                <div className="step-marker">
                  <span className="step-number">01</span>
                </div>
                <h3>Đăng ký trực tuyến</h3>
                <p>
                  Truy cập website hoặc ứng dụng để đặt lịch. Chọn vaccine, ngày giờ, nhận mã QR qua email/SMS trong 2-3 phút.
                </p>
              </div>

              <div className="timeline-step">
                <div className="step-marker">
                  <span className="step-number">02</span>
                </div>
                <h3>Chuẩn bị trước khi đến</h3>
                <p>
                  Mang CMND/CCCD, mã QR, hồ sơ y tế (nếu có). Đeo khẩu trang, ăn nhẹ, tuân thủ 5K.
                </p>
              </div>

              <div className="timeline-step">
                <div className="step-marker">
                  <span className="step-number">03</span>
                </div>
                <h3>Khám sàng lọc</h3>
                <p>
                  Bác sĩ kiểm tra nhiệt độ, huyết áp, tiền sử bệnh lý. Thời gian 5-10 phút để xác định điều kiện tiêm.
                </p>
              </div>

              <div className="timeline-step">
                <div className="step-marker">
                  <span className="step-number">04</span>
                </div>
                <h3>Tiêm vaccine</h3>
                <p>
                  Nhân viên y tế thực hiện trong phòng vô trùng, nhanh chóng và không đau.
                </p>
              </div>

              <div className="timeline-step">
                <div className="step-marker">
                  <span className="step-number">05</span>
                </div>
                <h3>Theo dõi sau tiêm</h3>
                <p>
                  Nghỉ ngơi 30 phút, nhận giấy chứng nhận và hướng dẫn chăm sóc qua ứng dụng/giấy in.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Lưu ý */}
        <section className="info-section">
          <div className="info-card">
            <h2 className="section-title">
              <Info size={24} className="info-icon" />
              Lưu ý cần biết
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <h4>Trước khi tiêm</h4>
                <ul>
                  <li>Ngủ đủ giấc, tránh rượu bia 24h.</li>
                  <li>Thông báo nếu đang dùng thuốc/mang thai.</li>
                  <li>Ăn nhẹ để tránh hạ đường huyết.</li>
                </ul>
              </div>
              <div className="info-item">
                <h4>Sau khi tiêm</h4>
                <ul>
                  <li>Nghỉ ngơi, tránh vận động mạnh 24h.</li>
                  <li>Uống nước, theo dõi nhiệt độ cơ thể.</li>
                  <li>Liên hệ y tế nếu sốt cao hoặc sưng đau.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-action (Cải tiến) */}
        <section className="cta-section">
          <div className="cta-wrapper">
            <h3 className="cta-title">Sẵn sàng bảo vệ sức khỏe?</h3>
            <p className="cta-subtitle">Hãy bắt đầu hành trình tiêm chủng ngay hôm nay!</p>
            <Link to="/booking" className="cta-button">
              Đặt lịch ngay <ChevronRight size={20} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default VaccinationHandbook;