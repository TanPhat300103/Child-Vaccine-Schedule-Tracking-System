import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  ChevronRight,
  Syringe,
  Calendar,
  Baby,
  Thermometer,
  Frown,
  Heart,
  Egg,
  Stethoscope,
  Shield,
  Brain,
  Book,
  User,
  Clock,
  Droplet,
  AlertTriangle,
  Bath,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../style/VaccinationFAQ.css";

const VaccinationFAQ = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQs, setOpenFAQs] = useState({});
  const [filteredFAQs, setFilteredFAQs] = useState([]);

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "schedule", name: "Lịch tiêm chủng" },
    { id: "safety", name: "An toàn" },
    { id: "sideEffects", name: "Tác dụng phụ" },
    { id: "special", name: "Trường hợp đặc biệt" },
  ];

  const faqs = [
    {
      id: 1,
      category: "schedule",
      question: "Trẻ em nên bắt đầu tiêm vắc xin từ khi nào?",
      answer:
        "Trẻ em nên bắt đầu tiêm vắc xin ngay từ khi mới sinh. Mũi tiêm đầu tiên thường là vắc xin viêm gan B, được tiêm trong vòng 24 giờ sau sinh. Sau đó, trẻ sẽ tiếp tục tiêm các mũi khác theo lịch tiêm chủng quốc gia.",
      icon: <Syringe size={24} />,
    },
    {
      id: 2,
      category: "schedule",
      question: "Lịch tiêm chủng cho trẻ em bao gồm những mũi nào?",
      answer:
        "Lịch tiêm chủng quốc gia cho trẻ em tại Việt Nam bao gồm các mũi quan trọng như: viêm gan B, lao (BCG), bạch hầu, ho gà, uốn ván, bại liệt, sởi, viêm não Nhật Bản, và Hib. Trẻ cần tiêm đầy đủ các mũi từ sơ sinh đến 5 tuổi.",
      icon: <Calendar size={24} />,
    },
    {
      id: 3,
      category: "schedule",
      question: "Trẻ sơ sinh có cần tiêm vắc xin viêm gan B không?",
      answer:
        "Có, vắc xin viêm gan B rất quan trọng cho trẻ sơ sinh. Mũi đầu tiên nên được tiêm trong vòng 24 giờ sau sinh để bảo vệ trẻ khỏi nguy cơ lây nhiễm từ mẹ hoặc môi trường xung quanh.",
      icon: <Baby size={24} />,
    },
    {
      id: 4,
      category: "safety",
      question: "Trẻ bị sốt nhẹ có nên tiêm vắc xin không?",
      answer:
        "Nếu trẻ chỉ sốt nhẹ (dưới 38°C) và sức khỏe ổn định, vẫn có thể tiêm vắc xin. Tuy nhiên, bạn nên tham khảo ý kiến bác sĩ để đảm bảo trẻ đủ sức khỏe và không có dấu hiệu nhiễm trùng nghiêm trọng.",
      icon: <Thermometer size={24} />,
    },
    {
      id: 5,
      category: "sideEffects",
      question: "Vắc xin có thể gây sốt cho trẻ không?",
      answer:
        "Có, sốt nhẹ là phản ứng bình thường sau khi tiêm vắc xin, thường kéo dài 1-2 ngày. Đây là dấu hiệu cơ thể trẻ đang xây dựng miễn dịch. Bạn có thể cho trẻ uống paracetamol theo chỉ định của bác sĩ để hạ sốt.",
      icon: <Frown size={24} />,
    },
    {
      id: 6,
      category: "sideEffects",
      question: "Làm sao để giảm đau cho trẻ khi tiêm vắc xin?",
      answer:
        "Để giảm đau, bạn có thể cho trẻ bú sữa mẹ hoặc cho uống một chút nước đường trước khi tiêm. Sau khi tiêm, chườm mát chỗ tiêm và ôm ấp trẻ để trẻ cảm thấy an tâm hơn.",
      icon: <Heart size={24} />,
    },
    {
      id: 7,
      category: "special",
      question: "Trẻ bị dị ứng trứng có tiêm vắc xin sởi được không?",
      answer:
        "Vắc xin sởi hiện nay thường an toàn cho trẻ dị ứng trứng. Tuy nhiên, nếu trẻ có tiền sử dị ứng nghiêm trọng, bạn nên tham khảo ý kiến bác sĩ để được theo dõi kỹ hơn sau khi tiêm.",
      icon: <Egg size={24} />,
    },
    {
      id: 8,
      category: "special",
      question: "Trẻ sinh non có cần tiêm vắc xin theo lịch không?",
      answer:
        "Trẻ sinh non vẫn cần tiêm vắc xin theo lịch tiêm chủng, nhưng thời gian có thể được điều chỉnh tùy theo sức khỏe của trẻ. Bác sĩ sẽ đánh giá và đưa ra lịch tiêm phù hợp.",
      icon: <Stethoscope size={24} />,
    },
    {
      id: 9,
      category: "sideEffects",
      question: "Vắc xin BCG có để lại sẹo cho trẻ không?",
      answer:
        "Có, vắc xin BCG (phòng lao) thường để lại một vết sẹo nhỏ trên cánh tay trái của trẻ sau khi tiêm khoảng 4-6 tuần. Đây là dấu hiệu bình thường và cho thấy vắc xin đã hoạt động hiệu quả.",
      icon: <Shield size={24} />,
    },
    {
      id: 10,
      category: "safety",
      question: "Trẻ tiêm vắc xin có cần kiêng tắm không?",
      answer:
        "Không, trẻ vẫn có thể tắm sau khi tiêm vắc xin. Tuy nhiên, bạn nên tránh chà xát mạnh vào chỗ tiêm và lau khô kỹ để tránh nhiễm trùng.",
      icon: <Bath size={24} />,
    },
    {
      id: 11,
      category: "sideEffects",
      question: "Vắc xin có thể gây phản ứng phụ nghiêm trọng cho trẻ không?",
      answer:
        "Phản ứng phụ nghiêm trọng rất hiếm gặp, thường dưới 1/1.000.000 trường hợp. Các phản ứng nhẹ như sốt, sưng chỗ tiêm là phổ biến hơn. Nếu trẻ có dấu hiệu bất thường như khó thở, co giật, hãy đưa trẻ đến bác sĩ ngay.",
      icon: <AlertTriangle size={24} />,
    },
    {
      id: 12,
      category: "schedule",
      question: "Trẻ em có cần tiêm vắc xin cúm hàng năm không?",
      answer:
        "Có, trẻ từ 6 tháng tuổi trở lên nên tiêm vắc xin cúm hàng năm, đặc biệt là trẻ có sức đề kháng yếu hoặc sống ở khu vực có nguy cơ cao. Vắc xin cúm giúp giảm nguy cơ mắc bệnh và biến chứng.",
      icon: <Droplet size={24} />,
    },
    {
      id: 13,
      category: "schedule",
      question: "Vắc xin phòng thủy đậu có cần thiết không?",
      answer:
        "Có, vắc xin thủy đậu rất cần thiết vì bệnh thủy đậu có thể gây biến chứng nguy hiểm như nhiễm trùng da hoặc viêm phổi. Trẻ nên tiêm 2 liều: liều đầu lúc 12-15 tháng, liều thứ hai lúc 4-6 tuổi.",
      icon: <Zap size={24} />,
    },
    {
      id: 14,
      category: "safety",
      question: "Trẻ em có thể tiêm nhiều vắc xin cùng lúc không?",
      answer:
        "Có, trẻ có thể tiêm nhiều vắc xin cùng lúc mà không ảnh hưởng đến hiệu quả. Các vắc xin được thiết kế để an toàn khi kết hợp, nhưng bác sĩ sẽ quyết định dựa trên tình trạng sức khỏe của trẻ.",
      icon: <Syringe size={24} />,
    },
    {
      id: 15,
      category: "safety",
      question: "Trẻ em bị cảm cúm có nên hoãn tiêm vắc xin không?",
      answer:
        "Nếu trẻ chỉ bị cảm cúm nhẹ, không sốt cao, vẫn có thể tiêm vắc xin. Tuy nhiên, nếu trẻ sốt trên 38°C hoặc có triệu chứng nặng, bạn nên hoãn lại và tham khảo ý kiến bác sĩ.",
      icon: <Frown size={24} />,
    },
    {
      id: 16,
      category: "safety",
      question: "Vắc xin có bảo vệ trẻ 100% không?",
      answer:
        "Không vắc xin nào bảo vệ 100%, nhưng chúng giúp giảm nguy cơ mắc bệnh nghiêm trọng đáng kể (thường hiệu quả 85-95%). Trẻ vẫn cần duy trì vệ sinh và lối sống lành mạnh để tăng cường bảo vệ.",
      icon: <Shield size={24} />,
    },
    {
      id: 17,
      category: "schedule",
      question: "Trẻ em có cần tiêm vắc xin viêm não Nhật Bản không?",
      answer:
        "Có, vắc xin viêm não Nhật Bản rất quan trọng, đặc biệt ở khu vực có nguy cơ cao. Trẻ nên tiêm 3 liều cơ bản: 2 liều đầu cách nhau 1-2 tuần (từ 1 tuổi), liều thứ 3 sau 1 năm.",
      icon: <Brain size={24} />,
    },
    {
      id: 18,
      category: "schedule",
      question: "Làm sao để biết trẻ đã tiêm đủ vắc xin chưa?",
      answer:
        "Bạn nên giữ sổ tiêm chủng của trẻ và kiểm tra với bác sĩ định kỳ. Sổ tiêm chủng ghi rõ các mũi đã tiêm và lịch tiêm nhắc lại để đảm bảo trẻ không bỏ sót mũi nào.",
      icon: <Book size={24} />,
    },
    {
      id: 19,
      category: "schedule",
      question: "Trẻ em có cần tiêm vắc xin HPV không?",
      answer:
        "Vắc xin HPV thường được khuyến cáo cho trẻ từ 9-14 tuổi để phòng ngừa virus gây ung thư cổ tử cung và các bệnh liên quan. Trẻ nên tiêm 2 liều, cách nhau 6-12 tháng.",
      icon: <User size={24} />,
    },
    {
      id: 20,
      category: "schedule",
      question: "Nếu trẻ bỏ lỡ một mũi vắc xin thì phải làm sao?",
      answer:
        "Nếu trẻ bỏ lỡ một mũi, bạn nên đưa trẻ đi tiêm bổ sung sớm nhất có thể. Bác sĩ sẽ tư vấn lịch tiêm bù để đảm bảo trẻ vẫn được bảo vệ đầy đủ mà không cần bắt đầu lại từ đầu.",
      icon: <Clock size={24} />,
    },
  ];

  useEffect(() => {
    let result = faqs;

    if (activeCategory !== "all") {
      result = result.filter((faq) => faq.category === activeCategory);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }

    setFilteredFAQs(result);
  }, [activeCategory, searchQuery]);

  const toggleFAQ = (id) => {
    setOpenFAQs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setOpenFAQs({});
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setOpenFAQs({});
  };

  return (
    <div className="vaccination-faq">
      <section className="faq-hero">
        <div className="hero-content">
          <h1>Câu Hỏi Thường Gặp Về Tiêm Chủng</h1>
          <p>
            Những thông tin quan trọng giúp bạn hiểu rõ hơn về việc tiêm chủng
            cho trẻ em
          </p>
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="   Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>
        </div>
        <div className="hero-decoration">
          <div className="hero-circle-1"></div>
          <div className="hero-circle-2"></div>
          <div className="hero-circle-3"></div>
          <div className="hero-circle-4"></div>
          <div className="hero-circle-5"></div>
        </div>
      </section>

      <section className="faq-content">
        <div className="faq-container">
          <div className="faq-categories">
            <div className="categories-header">
              <h2>Danh mục</h2>
              <button className="reset-button" onClick={resetFilters}>
                <RefreshCw size={14} />
                <span>Reset</span>
              </button>
            </div>
            <div className="category-list">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-button ${
                    activeCategory === category.id ? "active" : ""
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                  {activeCategory === category.id && <ChevronRight size={16} />}
                </button>
              ))}
            </div>
            <div className="faq-stats">
              <p>
                <strong>{filteredFAQs.length}</strong> câu hỏi phù hợp
              </p>
            </div>
          </div>

          <div className="faq-list">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className={`faq-item ${openFAQs[faq.id] ? "open" : ""}`}
                >
                  <div
                    className="faq-question"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <div className="question-content">
                      <span className="faq-icon">{faq.icon}</span>
                      <h3>{faq.question}</h3>
                    </div>
                  </div>
                  {openFAQs[faq.id] && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-results">
                <h3>Không tìm thấy câu hỏi phù hợp</h3>
                <p>Vui lòng thử từ khóa khác hoặc chọn danh mục khác</p>
                <button className="reset-button" onClick={resetFilters}>
                  <RefreshCw size={16} />
                  <span>Reset bộ lọc</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="helpful-resources">
        <div className="resources-content">
          <h2>Tài nguyên hữu ích</h2>
          <p>Tìm hiểu thêm về tiêm chủng và cách bảo vệ sức khỏe cho trẻ</p>
          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon">
                <Calendar size={40} />
              </div>
              <h3>Lịch tiêm chủng</h3>
              <p>Xem lịch tiêm chủng đầy đủ cho trẻ em từ sơ sinh đến 6 tuổi</p>
            </div>
            <div className="resource-card">
              <div className="resource-icon">
                <Syringe size={40} />
              </div>
              <h3>Ứng dụng nhắc lịch</h3>
              <p>
                Tải ứng dụng nhắc lịch tiêm chủng để không bỏ lỡ mũi tiêm nào
              </p>
            </div>
            <div className="resource-card">
              <div className="resource-icon">
                <Stethoscope size={40} />
              </div>
              <h3>Tìm trung tâm tiêm chủng</h3>
              <p>Các trung tâm tiêm chủng uy tín gần địa điểm của bạn</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VaccinationFAQ;
