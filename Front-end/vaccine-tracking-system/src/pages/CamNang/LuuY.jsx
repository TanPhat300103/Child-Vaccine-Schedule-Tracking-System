import React from "react";
import {
  Info,
  ArrowLeft,
  ChevronRight,
  Phone,
  AlertTriangle,
  HelpCircle,
  Syringe,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../CamNang/LuuY.css";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";

function LuuY() {
  return (
    <div>
      <Header></Header>{" "}
      <div className="vaccination-notes-page">
        {/* Header */}
        <header className="page-header">
          <div className="header-overlay"></div>
          <Link to="/" className="back-btn">
            <ArrowLeft size={24} /> Quay lại
          </Link>
          <div className="header-content">
            <h1>Lưu Ý Tiêm Chủng</h1>
            <p>Chuẩn bị tốt, tiêm chủng an toàn – Hành trang cho sức khỏe!</p>
            <div className="header-decoration">
              <Syringe size={50} className="syringe-icon" />
            </div>
          </div>
        </header>

        {/* Intro + Main Notes */}
        <section className="intro-notes-section">
          <div className="intro-container">
            <h2>Tại sao cần chuẩn bị kỹ?</h2>
            <p>
              Tiêm chủng không chỉ là một mũi tiêm – đó là quá trình bảo vệ sức
              khỏe dài hạn. Chuẩn bị kỹ lưỡng trước và chăm sóc cẩn thận sau
              tiêm giúp bạn giảm rủi ro, tăng hiệu quả vaccine và yên tâm hơn.
            </p>
          </div>
          <div className="main-notes">
            {/* Trước khi tiêm */}
            <div className="notes-group before-injection">
              <h2>Trước Khi Tiêm</h2>
              <div className="notes-grid">
                <div className="note-item">
                  <Info size={40} className="note-icon" />
                  <h3>Chuẩn bị sức khỏe</h3>
                  <ul>
                    <li>Ngủ đủ 6-8 tiếng để cơ thể khỏe mạnh.</li>
                    <li>Tránh rượu bia, cà phê 48h trước.</li>
                    <li>Ăn nhẹ trước khi đi, tránh bụng đói.</li>
                    <li>Mặc áo rộng tay để tiện tiêm.</li>
                  </ul>
                  <p className="example">
                    Ví dụ: Thay cà phê bằng nước ép trái cây.
                  </p>
                </div>
                <div className="note-item">
                  <Info size={40} className="note-icon" />
                  <h3>Giấy tờ & Tinh thần</h3>
                  <ul>
                    <li>Mang CMND/CCCD, mã QR đặt lịch.</li>
                    <li>Chuẩn bị hồ sơ y tế nếu có bệnh nền.</li>
                    <li>Giữ tinh thần thoải mái.</li>
                    <li>Đến sớm 15 phút để làm thủ tục.</li>
                  </ul>
                  <p className="example">
                    Ví dụ: Quên mã QR thì hỏi nhân viên hỗ trợ.
                  </p>
                </div>
              </div>
            </div>

            {/* Sau khi tiêm */}
            <div className="notes-group after-injection">
              <h2>Sau Khi Tiêm</h2>
              <div className="notes-grid">
                <div className="note-item">
                  <Info size={40} className="note-icon" />
                  <h3>Theo dõi sức khỏe</h3>
                  <ul>
                    <li>Nghỉ tại điểm tiêm 30 phút.</li>
                    <li>Đo nhiệt độ trong 48h đầu.</li>
                    <li>Uống đủ nước, tránh vận động mạnh.</li>
                    <li>Bổ sung vitamin C từ cam, chanh.</li>
                  </ul>
                  <p className="example">
                    Ví dụ: Uống nước cam để hồi phục nhanh.
                  </p>
                </div>
                <div className="note-item">
                  <Info size={40} className="note-icon" />
                  <h3>Xử lý phản ứng</h3>
                  <ul>
                    <li>Chườm mát nếu chỗ tiêm sưng đau.</li>
                    <li>Dùng paracetamol nếu sốt nhẹ.</li>
                    <li>Ghi lại triệu chứng lạ.</li>
                    <li>Liên hệ y tế nếu sốt cao kéo dài.</li>
                  </ul>
                  <p className="example">
                    Ví dụ: Sưng nhẹ là bình thường, nếu lan rộng thì đi khám.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ + Fun Facts */}
        <section className="faq-facts-section">
          <div className="faq-container">
            <h2>Câu Hỏi Thường Gặp</h2>
            <div className="faq-list">
              <div className="faq-item">
                <HelpCircle size={24} className="faq-icon" />
                <div>
                  <h3>Tôi có cần nhịn ăn trước khi tiêm không?</h3>
                  <p>Không, bạn nên ăn nhẹ để tránh hạ đường huyết.</p>
                </div>
              </div>
              <div className="faq-item">
                <HelpCircle size={24} className="faq-icon" />
                <div>
                  <h3>Sốt sau tiêm bao lâu thì nguy hiểm?</h3>
                  <p>
                    Sốt nhẹ 1-2 ngày là bình thường. Nếu trên 38.5°C kéo dài,
                    liên hệ y tế.
                  </p>
                </div>
              </div>
              <div className="faq-item">
                <HelpCircle size={24} className="faq-icon" />
                <div>
                  <h3>Tôi có thể tắm sau khi tiêm không?</h3>
                  <p>Có, nhưng tránh chà xát chỗ tiêm.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="facts-container">
            <h2>Thông Tin Thú Vị</h2>
            <div className="facts-grid">
              <div className="fact-item">
                <Syringe size={30} className="fact-icon" />
                <p>
                  Vaccine đầu tiên được phát minh năm 1796 bởi Edward Jenner.
                </p>
              </div>
              <div className="fact-item">
                <Syringe size={30} className="fact-icon" />
                <p>Vaccine cứu sống 2-3 triệu người mỗi năm.</p>
              </div>
              <div className="fact-item">
                <Syringe size={30} className="fact-icon" />
                <p>
                  Phản ứng nhẹ sau tiêm là dấu hiệu cơ thể xây dựng miễn dịch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="tips-section">
          <h2>Mẹo Nhỏ Hữu Ích</h2>
          <div className="tips-grid">
            <div className="tip-item">
              <Info size={30} className="tip-icon" />
              <p>Mang chai nước để uống tại điểm tiêm.</p>
            </div>
            <div className="tip-item">
              <Info size={30} className="tip-icon" />
              <p>Hỏi bác sĩ về lịch tiêm nhắc lại.</p>
            </div>
            <div className="tip-item">
              <Info size={30} className="tip-icon" />
              <p>Chuẩn bị số liên lạc khẩn cấp.</p>
            </div>
          </div>
        </section>

        {/* Emergency + CTA */}
        <section className="emergency-cta-section">
          <div className="emergency-container">
            <h2>Khi Nào Cần Liên Hệ Y Tế?</h2>
            <div className="emergency-content">
              <AlertTriangle size={40} className="emergency-icon" />
              <div>
                <p>
                  Gọi ngay <strong>115</strong> nếu gặp các dấu hiệu sau:
                </p>
                <ul>
                  <li>Khó thở, tức ngực kéo dài.</li>
                  <li>Sốt cao trên 39°C không giảm.</li>
                  <li>Phát ban toàn thân hoặc sưng mặt.</li>
                </ul>
              </div>
            </div>
            <div className="emergency-contact">
              <Phone size={24} />
              <p>
                Hotline 24/7: <strong>1900 1234</strong>
              </p>
            </div>
          </div>
          <div className="cta-container">
            <h2>Bạn Đã Sẵn Sàng?</h2>
            <p>Đặt lịch tiêm ngay hôm nay!</p>
            <Link to="/" className="cta-btn">
              Khám Phá Thêm <ChevronRight size={24} />
            </Link>
          </div>
        </section>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default LuuY;
