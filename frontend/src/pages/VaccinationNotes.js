import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/VaccinationNotes.css";
import {
  ArrowLeft,
  Check,
  Clock,
  Activity,
  Shield,
  AlertTriangle,
  Phone,
  Calendar,
  ChevronRight,
  ChevronDown,
  Info,
  Thermometer,
  Heart,
  FileText,
  Droplet,
  Bookmark,
  BookOpen,
} from "lucide-react";

function VaccinationNotes() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="vaccination-page">
      {/* Header - Thiết kế lại */}

      {/* Main Container */}
      <div className="main-container">
        {/* Hero Card */}
        <div className="card hero-card">
          <div className="hero-card__content">
            <h2 className="hero-card__title">
              Tại sao chuẩn bị kỹ là rất quan trọng?
            </h2>
            <p className="hero-card__text">
              Chuẩn bị đầy đủ trước khi tiêm chủng không chỉ giúp quá trình tiêm
              diễn ra suôn sẻ mà còn tăng hiệu quả của vaccine và giảm thiểu các
              phản ứng phụ không mong muốn. Bằng cách tuân thủ các hướng dẫn đơn
              giản, bạn có thể bảo vệ bản thân và cộng đồng một cách tốt nhất.
            </p>
            <div className="hero-card__stats">
              <div className="hero-card__stat">
                <div className="hero-card__stat-number">95%</div>
                <div className="hero-card__stat-label">
                  Hiệu quả khi tuân thủ hướng dẫn
                </div>
              </div>
              <div className="hero-card__stat">
                <div className="hero-card__stat-number">30+</div>
                <div className="hero-card__stat-label">
                  Năm kinh nghiệm y tế toàn cầu
                </div>
              </div>
            </div>
          </div>
          <div className="hero-card__image">
            <img
              src={
                "https://img.freepik.com/premium-photo/rose-garden-film-color-blended_795610-756.jpg"
              }
              alt="Chuẩn bị tiêm chủng"
              className="hero-card__image-img"
            />
          </div>
        </div>

        {/* Steps Section */}
        <section className="steps-section">
          <h2 className="section-title">Các bước cần thực hiện</h2>
          <div className="grid grid--2-cols">
            {/* Trước khi tiêm */}
            <div className="card step-card">
              <div className="step-card__number">1</div>
              <h3 className="step-card__title">Trước khi tiêm</h3>
              <ul className="step-card__list">
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Ngủ đủ giấc (6-8 tiếng) trước ngày tiêm</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Ăn đủ bữa, tránh đói khi đi tiêm</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Uống đủ nước, tránh rượu bia 48h trước</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Mặc áo rộng tay để dễ tiếp cận vị trí tiêm</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Mang theo CMND/CCCD và giấy tờ cần thiết</span>
                </li>
              </ul>
            </div>

            {/* Trong khi tiêm */}
            <div className="card step-card">
              <div className="step-card__number">2</div>
              <h3 className="step-card__title">Trong khi tiêm</h3>
              <ul className="step-card__list">
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Đến sớm 15-30 phút để hoàn thành thủ tục</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Thông báo với nhân viên y tế về tiền sử dị ứng</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Thư giãn cơ bắp để giảm đau khi tiêm</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Giữ bình tĩnh và hít thở sâu nếu lo lắng</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Đọc kỹ phiếu đồng ý tiêm chủng trước khi ký</span>
                </li>
              </ul>
            </div>

            {/* Ngay sau khi tiêm */}
            <div className="card step-card">
              <div className="step-card__number">3</div>
              <h3 className="step-card__title">Ngay sau khi tiêm</h3>
              <ul className="step-card__list">
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Nghỉ tại điểm tiêm ít nhất 30 phút để theo dõi</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>
                    Báo ngay cho nhân viên y tế nếu thấy khó thở, chóng mặt
                  </span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Uống nhiều nước để giữ cơ thể đủ nước</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Hạn chế vận động mạnh trong vài giờ đầu</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>
                    Lấy giấy xác nhận Đã tiêm và lịch tiêm mũi tiếp theo
                  </span>
                </li>
              </ul>
            </div>

            {/* Trong 48h sau tiêm */}
            <div className="card step-card">
              <div className="step-card__number">4</div>
              <h3 className="step-card__title">Trong 48h sau tiêm</h3>
              <ul className="step-card__list">
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Theo dõi nhiệt độ cơ thể thường xuyên</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Chườm mát tại vị trí tiêm nếu bị sưng đau</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Có thể dùng paracetamol nếu sốt nhẹ hoặc đau đầu</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Tránh uống rượu và tập thể dục cường độ cao</span>
                </li>
                <li className="step-card__list-item">
                  <Check className="step-card__check" size={18} />
                  <span>Ghi lại các triệu chứng bất thường nếu có</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <div className="grid grid--3-cols">
          <div className="card card--with-icons">
            <h3 className="card__title">
              <div className="card__title-icon">
                <Clock size={24} />
              </div>
              Thời gian hồi phục
            </h3>
            <p>
              Phần lớn người tiêm sẽ hồi phục hoàn toàn trong vòng 24-48 giờ.
              Các triệu chứng nhẹ như đau tại chỗ tiêm, mệt mỏi và đau đầu là
              dấu hiệu bình thường khi cơ thể đang xây dựng khả năng bảo vệ.
            </p>
          </div>

          <div className="card card--with-icons">
            <h3 className="card__title">
              <div className="card__title-icon">
                <Activity size={24} />
              </div>
              Các phản ứng thường gặp
            </h3>
            <p>
              Đau, sưng tại vị trí tiêm; sốt nhẹ dưới 38.5°C; mệt mỏi, đau cơ,
              đau đầu trong 1-2 ngày đầu. Những triệu chứng này thường tự khỏi
              và là dấu hiệu hệ miễn dịch đang làm việc.
            </p>
          </div>

          <div className="card card--with-icons">
            <h3 className="card__title">
              <div className="card__title-icon">
                <Shield size={24} />
              </div>
              Thời gian có hiệu lực
            </h3>
            <p>
              Tùy loại vaccine, khả năng bảo vệ bắt đầu phát triển từ 2-3 tuần
              sau tiêm và đạt mức tối đa sau 1-2 tháng. Một số loại cần tiêm
              nhắc lại để duy trì hiệu quả lâu dài.
            </p>
          </div>
        </div>

        {/* Tips Section */}
        <section className="tips-section">
          <h2 className="section-title">Mẹo hữu ích</h2>
          <div className="grid grid--2-cols">
            <div className="card tip-card">
              <Thermometer className="tip-card__icon" size={24} />
              <p className="tip-card__text">
                Nếu sốt nhẹ sau tiêm, hãy nghỉ ngơi và uống nhiều nước. Có thể
                dùng khăn mát để lau người giúp giảm nhiệt độ cơ thể.
              </p>
            </div>
            <div className="card tip-card">
              <Heart className="tip-card__icon" size={24} />
              <p className="tip-card__text">
                Giữ tinh thần thoải mái trước và sau tiêm để hệ miễn dịch hoạt
                động tốt hơn. Nghe nhạc hoặc thiền nhẹ có thể giúp bạn thư giãn.
              </p>
            </div>
            <div className="card tip-card">
              <FileText className="tip-card__icon" size={24} />
              <p className="tip-card__text">
                Ghi lại mọi triệu chứng sau tiêm vào sổ tay hoặc ứng dụng sức
                khỏe để tiện theo dõi và báo cáo nếu cần.
              </p>
            </div>
            <div className="card tip-card">
              <Droplet className="tip-card__icon" size={24} />
              <p className="tip-card__text">
                Uống đủ 2-3 lít nước mỗi ngày sau tiêm để hỗ trợ cơ thể phục hồi
                nhanh chóng.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default VaccinationNotes;
