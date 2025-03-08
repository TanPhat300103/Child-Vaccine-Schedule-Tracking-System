import React from 'react';
import { Calendar, Shield, Clock, MessageSquare } from 'lucide-react';
import './Features.css';

const Features = () => {
  const featureItems = [
    {
      icon: <Calendar size={22} />,
      title: "Đặt Lịch Dễ Dàng",
      description: "Đặt lịch tiêm nhanh chóng"
    },
    {
      icon: <Shield size={22} />,
      title: "Dịch Vụ An Toàn",
      description: "Tiêu chuẩn y tế cao cấp"
    },
    {
      icon: <Clock size={22} />,
      title: "Hỗ Trợ 24/7",
      description: "Luôn sẵn sàng phục vụ"
    },
    {
      icon: <MessageSquare size={22} />,
      title: "Tư Vấn Miễn Phí",
      description: "Đội ngũ bác sĩ chuyên nghiệp"
    }
  ];

  return (
    <div className="features-container">
      {featureItems.map((feature, index) => (
        <div className="feature-item" key={index}>
          <div className="feature-icon">
            {feature.icon}
          </div>
          <div className="feature-text">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Features;