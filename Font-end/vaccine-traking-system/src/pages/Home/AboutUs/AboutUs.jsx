// src/pages/AboutUs/AboutUs.jsx
import React from 'react';
import Header from '../../../components/header/Header';
import Footer from "../../../components/footer/Footer";

const AboutUs = () => {
  return (
    <>
      {/* Header: Sẽ hiển thị ở đầu trang */}
      <Header />

      {/* Nội dung chính của trang About Us */}
      <main className="aboutus-main">
        <section className="aboutus-intro">
          <h1>Hệ thống Quản lý và Theo dõi Lịch Tiêm Chủng</h1>
          <p>
            Hệ thống của chúng tôi được xây dựng nhằm quản lý và theo dõi lịch tiêm chủng cho trẻ em tại một cơ sở tiêm chủng. Ứng dụng này cung cấp đầy đủ các chức năng hỗ trợ khách hàng cập nhật hồ sơ trẻ em, đặt lịch tiêm chủng theo các dịch vụ linh hoạt, nhận thông báo nhắc nhở các mũi tiêm cần thiết và ghi nhận phản ứng sau tiêm, đồng thời quản lý các quy trình tiêm chủng, thanh toán và đánh giá dịch vụ.
          </p>
        </section>

        <section className="aboutus-features">
          <h2>Chức năng chính của hệ thống</h2>
          <ul>
            <li>Giới thiệu thông tin cơ sở tiêm chủng, dịch vụ, bảng giá và cẩm nang tiêm chủng.</li>
            <li>Cập nhật thông tin hồ sơ trẻ em và theo dõi quá trình tiêm chủng.</li>
            <li>Cung cấp lịch tiêm chủng và xác định các mũi tiêm cần thiết theo độ tuổi.</li>
            <li>Cho phép khách hàng đặt lịch tiêm chủng theo dịch vụ: tiêm lẻ, trọn gói, cá thể hóa.</li>
            <li>Quản lý quá trình tiêm chủng tại cơ sở với việc ghi nhận kết quả vào hồ sơ của trẻ.</li>
            <li>Hỗ trợ thanh toán dịch vụ và thu thập đánh giá từ khách hàng.</li>
            <li>Gửi thông báo nhắc nhở lịch tiêm và ghi nhận thông tin phản ứng sau tiêm (nếu có).</li>
            <li>Quản lý chính sách thanh toán và hủy đơn đặt lịch tiêm chủng.</li>
            <li>Khai báo thông tin dịch vụ tiêm chủng và bảng giá.</li>
            <li>Quản lý rating, feedback, hồ sơ khách hàng, lịch sử đơn đặt lịch tiêm chủng và cung cấp báo cáo, dashboard.</li>
          </ul>
        </section>

        <section className="aboutus-mission">
          <h2>Sứ mệnh của chúng tôi</h2>
          <p>
            Sứ mệnh của hệ thống là đảm bảo mọi trẻ em đều nhận được lịch tiêm chủng đầy đủ và kịp thời, giúp cha mẹ yên tâm về sức khỏe của con em mình thông qua việc quản lý thông tin chính xác và cung cấp dịch vụ tiêm chủng hiệu quả.
          </p>
        </section>

        <section className="aboutus-reference">
          <h2>Tham khảo</h2>
          <p>
            Hệ thống được xây dựng dựa trên các tiêu chuẩn quốc tế và các thông tin tham khảo từ:
          </p>
          <ul>
            <li>
              <a href="https://vnvc.vn/" target="_blank" rel="noopener noreferrer">
                https://vnvc.vn/
              </a>
            </li>
            <li>
              <a href="https://www.cdc.gov/vaccines/schedules/" target="_blank" rel="noopener noreferrer">
                https://www.cdc.gov/vaccines/schedules/
              </a>
            </li>
          </ul>
        </section>
      </main>
    
        <Footer />
    </>
  );

};

export default AboutUs;
